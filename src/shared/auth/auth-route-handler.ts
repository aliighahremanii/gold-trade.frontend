import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { components as IdentityComponents } from "@/generated/api/identity";
import { getModuleBaseUrl } from "@/shared/api/config";
import {
  buildSessionAuthHeaders,
  clearSessionCookies,
  forwardSetCookieHeaders,
  setSessionCookies,
} from "@/shared/auth/session-cookie";
import { clearMobileVerificationAck } from "@/shared/auth/verification-ack-cookie";

type AuthTokensResponse = IdentityComponents["schemas"]["AuthTokensResponse"];
type AuthRequestBody = {
  deviceId?: string;
  deviceName?: string;
};

type AuthRoutePath = "/auth/sign-in" | "/auth/sign-up" | "/auth/sign-out";

export async function handleAuthRoute(request: Request, path: AuthRoutePath) {
  const backendUrl = `${getModuleBaseUrl("identity")}${path}`;
  const cookieStore = await cookies();
  const headers = new Headers({ "content-type": "application/json" });
  const requestBody = path === "/auth/sign-out" ? undefined : await request.text();

  if (path === "/auth/sign-out") {
    for (const [name, value] of Object.entries(buildSessionAuthHeaders(cookieStore))) {
      headers.set(name, value);
    }
  }

  const backendResponse = await fetch(backendUrl, {
    method: "POST",
    headers,
    body: requestBody,
  });

  if (path === "/auth/sign-out") {
    const responseBody = backendResponse.ok ? null : await backendResponse.text();
    const nextResponse = new NextResponse(responseBody, {
      status: backendResponse.ok ? 204 : backendResponse.status,
      headers: backendResponse.headers.get("content-type")
        ? { "content-type": backendResponse.headers.get("content-type")! }
        : undefined,
    });

    forwardSetCookieHeaders(backendResponse, nextResponse);
    clearSessionCookies(nextResponse);
    clearMobileVerificationAck(nextResponse);
    return nextResponse;
  }

  const responseBody = await backendResponse.text();
  const nextResponse = new NextResponse(responseBody || null, {
    status: backendResponse.status,
    headers: backendResponse.headers.get("content-type")
      ? { "content-type": backendResponse.headers.get("content-type")! }
      : undefined,
  });

  forwardSetCookieHeaders(backendResponse, nextResponse);

  if (backendResponse.ok && responseBody) {
    const tokens = JSON.parse(responseBody) as AuthTokensResponse;
    const body = requestBody ? (JSON.parse(requestBody) as AuthRequestBody) : undefined;

    if (tokens.accessToken && tokens.refreshToken && body?.deviceId && body.deviceName) {
      clearMobileVerificationAck(nextResponse);
      setSessionCookies(nextResponse, tokens, {
        deviceId: body.deviceId,
        deviceName: body.deviceName,
      });
    }
  }

  return nextResponse;
}
