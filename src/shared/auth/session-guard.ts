import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type CookieValue = {
  value: string;
};

export type CookieStoreLike = {
  get(name: string): CookieValue | undefined;
};

export type SessionGuardConfig = {
  sessionCookieName: string;
  adminRoleCookieName: string;
  adminRoleValue: string;
  signInPath: string;
};

export function getSessionGuardConfig(): SessionGuardConfig {
  return {
    sessionCookieName: process.env.FRONTEND_SESSION_COOKIE_NAME ?? "gt_session",
    adminRoleCookieName: process.env.FRONTEND_ADMIN_ROLE_COOKIE_NAME ?? "gt_role",
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

export function hasAdminSession(
  cookieStore: CookieStoreLike,
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  return (
    hasAuthenticatedSession(cookieStore, config) &&
    cookieStore.get(config.adminRoleCookieName)?.value === config.adminRoleValue
  );
}

export function buildSignInRedirect(
  nextPath: string,
  reason: "auth_required" | "admin_required" = "auth_required",
  config: SessionGuardConfig = getSessionGuardConfig(),
) {
  const params = new URLSearchParams({ next: nextPath, reason });

  return `${config.signInPath}?${params.toString()}`;
}

export async function requireAuthenticatedSession(nextPath: string) {
  const cookieStore = await cookies();

  if (!hasAuthenticatedSession(cookieStore)) {
    redirect(buildSignInRedirect(nextPath));
  }
}

export async function requireAdminSession(nextPath: string) {
  const cookieStore = await cookies();

  if (!hasAdminSession(cookieStore)) {
    redirect(buildSignInRedirect(nextPath, "admin_required"));
  }
}