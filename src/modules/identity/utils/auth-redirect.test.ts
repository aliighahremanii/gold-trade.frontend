import { describe, expect, it } from "vitest";

import { getSignInDescription } from "@/modules/identity/utils/sign-in-description";
import { resolvePostAuthPath, sanitizeNextPath } from "@/modules/identity/utils/auth-redirect";

describe("getSignInDescription", () => {
  it("shows the auth-required reason and preserves the next path", () => {
    expect(getSignInDescription("/dashboard", "auth_required")).toBe(
      "Sign in is required before you can continue. After sign-in, continue to /dashboard.",
    );
  });

  it("shows the admin-required reason when admin access is denied", () => {
    expect(getSignInDescription("/admin/dashboard", "admin_required")).toBe(
      "Administrator access is required to open that route. After sign-in, continue to /admin/dashboard.",
    );
  });

  it("shows a signed-out confirmation", () => {
    expect(getSignInDescription(undefined, "signed_out")).toBe(
      "You have signed out of this browser session.",
    );
  });

  it("shows a sign-out failure warning", () => {
    expect(getSignInDescription(undefined, "sign_out_failed")).toBe(
      "The browser session was cleared, but the server could not confirm session revocation.",
    );
  });
});

describe("resolvePostAuthPath", () => {
  it("routes unverified users to the verify page", () => {
    expect(
      resolvePostAuthPath(
        {
          requiresTotp: false,
          isEmailVerified: false,
          isMobileVerified: true,
        },
        "/dashboard",
      ),
    ).toBe("/verify?channel=email&purpose=email_verification&next=%2Fdashboard");
  });

  it("returns the next path when verification is complete", () => {
    expect(
      resolvePostAuthPath(
        {
          requiresTotp: false,
          isEmailVerified: true,
          isMobileVerified: true,
        },
        "/dashboard",
      ),
    ).toBe("/dashboard");
  });
});

describe("sanitizeNextPath", () => {
  it("rejects unsafe redirect targets", () => {
    expect(sanitizeNextPath("//evil.example")).toBe("/dashboard");
    expect(sanitizeNextPath(undefined)).toBe("/dashboard");
  });
});
