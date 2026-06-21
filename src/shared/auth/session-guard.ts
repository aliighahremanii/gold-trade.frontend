import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import type { paths as IdentityPaths } from "@/generated/api/identity";
import { createModuleClient } from "@/shared/api";

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
  adminRoleValue: string;
  signInPath: string;
};

type CurrentUserResponse =
  IdentityPaths["/me"]["get"]["responses"][200]["content"]["application/json"];

export function getSessionGuardConfig(): SessionGuardConfig {
  return {
    sessionCookieName: process.env.FRONTEND_SESSION_COOKIE_NAME ?? "gt_session",
    adminRoleValue: process.env.FRONTEND_ADMIN_ROLE_VALUE ?? "admin",
    signInPath: process.env.FRONTEND_SIGN_IN_PATH ?? "/sign-in",
  };
}

export function hasAuthenticatedSession(
  cookieStore: CookieStoreLike,
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  return Boolean(cookieStore.get(config.sessionCookieName)?.value);
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

function serializeCookies(cookieStore: CookieStoreLike) {
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`)
    .join("; ");
}

async function validateCurrentUser(cookieStore: CookieStoreLike) {
  if (!hasAuthenticatedSession(cookieStore)) {
    return null;
  }

  const cookieHeader = serializeCookies(cookieStore);
  const identityClient = createModuleClient<IdentityPaths>("identity", {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
  const result = await identityClient.GET("/me");

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

  if (!currentUser) {
    redirect(buildSignInRedirect(destination));
  }

  if (!userHasAdminRole(currentUser)) {
    redirect(buildSignInRedirect(destination, "admin_required"));
  }

  return currentUser;
}