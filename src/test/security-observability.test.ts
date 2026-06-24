import { describe, expect, it } from "vitest";

import { isAllowedProxyModule } from "@/shared/auth/proxy-backend-request";
import {
  evaluateAdminAccess,
  userHasAdminRole,
} from "@/shared/auth/session-guard";
import { normalizeApiError } from "@/shared/errors";

const adminConfig = {
  sessionCookieName: "gt_session",
  refreshCookieName: "gt_refresh",
  adminRoleValue: "admin",
  signInPath: "/sign-in",
};

describe("admin authorization guard", () => {
  it("allows authenticated admin users", () => {
    expect(
      evaluateAdminAccess({
        currentUser: { roles: ["customer", "admin"] },
        destination: "/admin/orders",
        config: adminConfig,
      }),
    ).toEqual({ type: "allow" });
  });

  it("redirects unauthenticated users to sign-in with destination preserved", () => {
    expect(
      evaluateAdminAccess({
        currentUser: null,
        destination: "/admin/reconciliation",
        config: adminConfig,
      }),
    ).toEqual({
      type: "sign_in",
      redirectTo: "/sign-in?next=%2Fadmin%2Freconciliation&reason=auth_required",
    });
  });

  it("redirects authenticated non-admin users to access denied", () => {
    expect(
      evaluateAdminAccess({
        currentUser: { roles: ["customer"] },
        destination: "/admin/payments",
        config: adminConfig,
      }),
    ).toEqual({
      type: "access_denied",
      redirectTo: "/access-denied?next=%2Fadmin%2Fpayments&reason=admin_required",
    });
  });

  it("rejects role cookie spoofing without backend-validated admin role", () => {
    expect(userHasAdminRole({ roles: ["customer"] }, adminConfig)).toBe(false);
    expect(userHasAdminRole({ roles: ["admin"] }, adminConfig)).toBe(true);
  });
});

describe("proxy module allowlist", () => {
  it("allows known backend modules only", () => {
    expect(isAllowedProxyModule("wallet")).toBe(true);
    expect(isAllowedProxyModule("admin")).toBe(true);
    expect(isAllowedProxyModule("unknown-module")).toBe(false);
  });
});

describe("operation reference on API errors", () => {
  it("maps correlation headers into normalized API errors", () => {
    const headers = new Headers({ "x-correlation-id": "corr-support-1" });
    const error = normalizeApiError({
      status: 500,
      body: { code: "unknown_error", message: "Unexpected failure." },
      responseHeaders: headers,
    });

    expect(error.operationReference).toBe("corr-support-1");
  });
});
