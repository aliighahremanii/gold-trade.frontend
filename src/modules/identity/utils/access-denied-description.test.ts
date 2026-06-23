import { describe, expect, it } from "vitest";

import { getAccessDeniedDescription } from "@/modules/identity/utils/access-denied-description";

describe("getAccessDeniedDescription", () => {
  it("explains missing administrator access for signed-in users", () => {
    expect(getAccessDeniedDescription("admin_required", "/admin/dashboard")).toBe(
      "Your account is signed in, but it does not have administrator access. The requested route was /admin/dashboard.",
    );
  });

  it("falls back to a generic denial message", () => {
    expect(getAccessDeniedDescription()).toBe("You do not have access to that route.");
  });
});
