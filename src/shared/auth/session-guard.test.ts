import { describe, expect, it } from "vitest";

import {
  buildSignInRedirect,
  getRequestedDestination,
  hasAuthenticatedSession,
  type CookieStoreLike,
  type HeaderStoreLike,
  type SessionGuardConfig,
  userHasAdminRole,
} from "@/shared/auth/session-guard";

const testConfig: SessionGuardConfig = {
  sessionCookieName: "session",
  adminRoleValue: "admin",
  signInPath: "/sign-in",
};

function createCookieStore(values: Record<string, string>): CookieStoreLike {
  return {
    get(name) {
      const value = values[name];

      return value ? { value } : undefined;
    },
    getAll() {
      return Object.entries(values).map(([name, value]) => ({ name, value }));
    },
  };
}

function createHeaderStore(values: Record<string, string>): HeaderStoreLike {
  return {
    get(name) {
      return values[name] ?? null;
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

  it("requires the validated current user to hold the configured admin role", () => {
    expect(userHasAdminRole({ roles: ["customer", "admin"] }, testConfig)).toBe(true);
    expect(userHasAdminRole({ roles: ["customer"] }, testConfig)).toBe(false);
  });

  it("preserves the middleware-provided request destination", () => {
    const headerStore = createHeaderStore({
      "x-request-path": "/delivery/abc-123",
      "x-request-search": "?step=confirm",
    });

    expect(getRequestedDestination(headerStore, "/dashboard")).toBe(
      "/delivery/abc-123?step=confirm",
    );
  });

  it("falls back when no middleware request destination is present", () => {
    const headerStore = createHeaderStore({});

    expect(getRequestedDestination(headerStore, "/dashboard")).toBe("/dashboard");
  });

  it("builds sign-in redirects with the original destination and reason", () => {
    expect(buildSignInRedirect("/admin/dashboard", "admin_required", testConfig)).toBe(
      "/sign-in?next=%2Fadmin%2Fdashboard&reason=admin_required",
    );
  });
});