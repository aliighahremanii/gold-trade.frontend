import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getModuleBaseUrl, type ApiModuleName } from "@/shared/api/config";
import type { paths as IdentityPaths } from "@/generated/api/identity";
import { createModuleClient } from "@/shared/api";
import {
  buildSessionAuthHeaders,
  clearSessionCookies,
  getRefreshToken,
  getStoredDeviceContext,
  setSessionCookies,
} from "@/shared/auth/session-cookie";

const ALLOWED_PROXY_MODULES: ApiModuleName[] = [
  "identity",
  "asset",
  "wallet",
  "pricing",
  "quote",
  "trading",
  "settlement",
  "payments",
  "delivery",
  "admin",
  "audit",
  "compliance",
  "reconciliation",
  "ledger",
  "notification",
  "liquidity",
];

export function isAllowedProxyModule(moduleName: string): moduleName is ApiModuleName {
  return ALLOWED_PROXY_MODULES.includes(moduleName as ApiModuleName);
}

export async function proxyBackendRequest(
  request: Request,
  moduleName: ApiModuleName,
  pathSegments: string[],
) {
  const requestUrl = new URL(request.url);
  const targetUrl = `${getModuleBaseUrl(moduleName)}/${pathSegments.join("/")}${requestUrl.search}`;
  const cookieStore = await cookies();
  const headers = new Headers(buildSessionAuthHeaders(cookieStore));

  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;

  async function forwardRequest(authorization?: string) {
    const forwardedHeaders = new Headers(headers);

    if (authorization) {
      forwardedHeaders.set("authorization", authorization);
    }

    return fetch(targetUrl, {
      method: request.method,
      headers: forwardedHeaders,
      body,
    });
  }

  let backendResponse = await forwardRequest();

  let refreshedTokens:
    | {
        accessToken: string;
        accessTokenExpiresAt: string;
        refreshToken: string;
        refreshTokenExpiresAt: string;
        deviceId: string;
        deviceName: string;
      }
    | null = null;

  if (backendResponse.status === 401) {
    const refreshToken = getRefreshToken(cookieStore);
    const deviceContext = getStoredDeviceContext(cookieStore);

    if (refreshToken && deviceContext) {
      const identityClient = createModuleClient<IdentityPaths>("identity", {
        baseUrl: getModuleBaseUrl("identity"),
      });
      const refreshed = await identityClient.POST("/auth/refresh", {
        body: {
          refreshToken,
          deviceId: deviceContext.deviceId,
          deviceName: deviceContext.deviceName,
        },
      });

      if (refreshed.data?.accessToken) {
        refreshedTokens = {
          accessToken: refreshed.data.accessToken,
          accessTokenExpiresAt: refreshed.data.accessTokenExpiresAt,
          refreshToken: refreshed.data.refreshToken,
          refreshTokenExpiresAt: refreshed.data.refreshTokenExpiresAt,
          deviceId: deviceContext.deviceId,
          deviceName: deviceContext.deviceName,
        };
        backendResponse = await forwardRequest(`Bearer ${refreshed.data.accessToken}`);
      }
    }
  }

  const responseHeaders = new Headers();
  const backendContentType = backendResponse.headers.get("content-type");

  if (backendContentType) {
    responseHeaders.set("content-type", backendContentType);
  }

  const nextResponse = new NextResponse(await backendResponse.arrayBuffer(), {
    status: backendResponse.status,
    headers: responseHeaders,
  });

  if (refreshedTokens) {
    setSessionCookies(
      nextResponse,
      {
        accessToken: refreshedTokens.accessToken,
        accessTokenExpiresAt: refreshedTokens.accessTokenExpiresAt,
        refreshToken: refreshedTokens.refreshToken,
        refreshTokenExpiresAt: refreshedTokens.refreshTokenExpiresAt,
      },
      {
        deviceId: refreshedTokens.deviceId,
        deviceName: refreshedTokens.deviceName,
      },
    );
  }

  if (backendResponse.status === 401 && !refreshedTokens) {
    clearSessionCookies(nextResponse);
  }

  return nextResponse;
}
