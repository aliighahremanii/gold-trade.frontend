import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { paths as IdentityPaths } from "@/generated/api/identity";
import { createModuleClient, getModuleBaseUrl } from "@/shared/api";
import {
  buildSessionAuthHeaders,
  getRefreshToken,
  getStoredDeviceContext,
} from "@/shared/auth/session-cookie";

export type CookieValue = {
  value: string;
};

export type CookieRecord = {
  name: string;
  value: string;
};

export type CookieStoreLike = {
  get(name: string): CookieValue | undefined;
  getAll(): CookieRecord[];
};

export type HeaderStoreLike = {
  get(name: string): string | null;
};

export type SessionGuardConfig = {
  sessionCookieName: string;
  refreshCookieName: string;
  adminRoleValue: string;
  signInPath: string;
};

type CurrentUserResponse =
  IdentityPaths["/me"]["get"]["responses"][200]["content"]["application/json"];

export function getSessionGuardConfig(): SessionGuardConfig {
  return {
    sessionCookieName: process.env.FRONTEND_SESSION_COOKIE_NAME ?? "gt_session",
    refreshCookieName: process.env.FRONTEND_REFRESH_COOKIE_NAME ?? "gt_refresh",
    adminRoleValue: process.env.FRONTEND_ADMIN_ROLE_VALUE ?? "admin",
    signInPath: process.env.FRONTEND_SIGN_IN_PATH ?? "/sign-in",
  };
}

export function hasAuthenticatedSession(
  cookieStore: CookieStoreLike,
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  return Boolean(
    cookieStore.get(config.sessionCookieName)?.value || cookieStore.get(config.refreshCookieName)?.value,
  );
}

export function userHasAdminRole(
  currentUser: Pick<CurrentUserResponse, "roles">,
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  return currentUser.roles.includes(config.adminRoleValue);
}

export function getRequestedDestination(
  headerStore: HeaderStoreLike,
  fallbackPath: string,
) {
  const pathname = headerStore.get("x-request-path")?.trim();
  const search = headerStore.get("x-request-search")?.trim() ?? "";

  if (!pathname) {
    return fallbackPath;
  }

  return `${pathname}${search}`;
}

export function buildSignInRedirect(
  nextPath: string,
  reason: "auth_required" | "admin_required" = "auth_required",
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  const params = new URLSearchParams({ next: nextPath, reason });

  return `${config.signInPath}?${params.toString()}`;
}

export function buildAccessDeniedRedirect(
  nextPath: string,
  reason: "admin_required" = "admin_required",
) {
  const params = new URLSearchParams({ next: nextPath, reason });

  return `/access-denied?${params.toString()}`;
}

export type AdminAccessDecision =
  | { type: "allow" }
  | { type: "sign_in"; redirectTo: string }
  | { type: "access_denied"; redirectTo: string };

export function evaluateAdminAccess(input: {
  currentUser: Pick<CurrentUserResponse, "roles"> | null;
  destination: string;
  config?: SessionGuardConfig;
}): AdminAccessDecision {
  const config = input.config ?? getSessionGuardConfig();

  if (!input.currentUser) {
    return {
      type: "sign_in",
      redirectTo: buildSignInRedirect(input.destination, "auth_required", config),
    };
  }

  if (!userHasAdminRole(input.currentUser, config)) {
    return {
      type: "access_denied",
      redirectTo: buildAccessDeniedRedirect(input.destination),
    };
  }

  return { type: "allow" };
}

async function validateCurrentUser(cookieStore: CookieStoreLike) {
  if (!hasAuthenticatedSession(cookieStore)) {
    return null;
  }

  const guardConfig = getSessionGuardConfig();

  const identityClient = createModuleClient<IdentityPaths>("identity", {
    baseUrl: getModuleBaseUrl("identity"),
    headers: buildSessionAuthHeaders(cookieStore, {
      sessionCookieName: guardConfig.sessionCookieName,
      refreshCookieName: guardConfig.refreshCookieName,
      deviceIdCookieName: process.env.FRONTEND_DEVICE_ID_COOKIE_NAME ?? "gt_device_id",
      deviceNameCookieName: process.env.FRONTEND_DEVICE_NAME_COOKIE_NAME ?? "gt_device_name",
    }),
  });
  let result = await identityClient.GET("/me");

  if (result.response.status === 401) {
    const refreshToken = getRefreshToken(cookieStore);
    const deviceContext = getStoredDeviceContext(cookieStore);

    if (refreshToken && deviceContext) {
      const refreshClient = createModuleClient<IdentityPaths>("identity", {
        baseUrl: getModuleBaseUrl("identity"),
      });
      const refreshed = await refreshClient.POST("/auth/refresh", {
        body: {
          refreshToken,
          deviceId: deviceContext.deviceId,
          deviceName: deviceContext.deviceName,
        },
      });

      if (refreshed.data?.accessToken) {
        const refreshedClient = createModuleClient<IdentityPaths>("identity", {
          baseUrl: getModuleBaseUrl("identity"),
          headers: {
            authorization: `Bearer ${refreshed.data.accessToken}`,
          },
        });

        result = await refreshedClient.GET("/me");
      }
    }
  }

  if (!result.data || result.error) {
    return null;
  }

  return result.data;
}

export async function requireAuthenticatedSession(fallbackPath = "/dashboard") {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const destination = getRequestedDestination(headerStore, fallbackPath);
  const currentUser = await validateCurrentUser(cookieStore);

  if (!currentUser) {
    redirect(buildSignInRedirect(destination));
  }

  return currentUser;
}

export async function requireAdminSession(fallbackPath = "/admin/dashboard") {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const destination = getRequestedDestination(headerStore, fallbackPath);
  const currentUser = await validateCurrentUser(cookieStore);
  const decision = evaluateAdminAccess({ currentUser, destination });

  if (decision.type === "sign_in") {
    redirect(decision.redirectTo);
  }

  if (decision.type === "access_denied") {
    redirect(decision.redirectTo);
  }

  return currentUser!;
}