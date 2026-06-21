import { describe, expect, it } from "vitest";

import {
  buildSignInRedirect,
  hasAdminSession,
  hasAuthenticatedSession,
  type CookieStoreLike,
  type SessionGuardConfig,
} from "@/shared/auth/session-guard";

const testConfig: SessionGuardConfig = {
  sessionCookieName: "session",
  adminRoleCookieName: "role",
  adminRoleValue: "admin",
  signInPath: "/sign-in",
};

function createCookieStore(values: Record<string, string>): CookieStoreLike {
  return {
    get(name) {
      const value = values[name];

      return value ? { value } : undefined;
    },
  };
}

describe("session guard", () => {
  it("accepts requests with a configured session cookie", () => {
    const cookieStore = createCookieStore({ session: "session-token" });

    expect(hasAuthenticatedSession(cookieStore, testConfig)).toBe(true);
  });

  it("rejects requests without the configured session cookie", () => {
    const cookieStore = createCookieStore({});

    expect(hasAuthenticatedSession(cookieStore, testConfig)).toBe(false);
  });

  it("requires both a session cookie and the configured admin role", () => {
    const allowed = createCookieStore({ session: "session-token", role: "admin" });
    const wrongRole = createCookieStore({ session: "session-token", role: "operator" });
    const missingSession = createCookieStore({ role: "admin" });

    expect(hasAdminSession(allowed, testConfig)).toBe(true);
    expect(hasAdminSession(wrongRole, testConfig)).toBe(false);
    expect(hasAdminSession(missingSession, testConfig)).toBe(false);
  });

  it("builds sign-in redirects with the original destination and reason", () => {
    expect(buildSignInRedirect("/admin/dashboard", "admin_required", testConfig)).toBe(
      "/sign-in?next=%2Fadmin%2Fdashboard&reason=admin_required",
    );
  });
});