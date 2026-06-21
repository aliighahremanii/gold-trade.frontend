import { describe, expect, it } from "vitest";

import { SignInScaffoldFlow } from "@/modules/identity/flows/sign-in-scaffold-flow";
import { ScaffoldPage } from "@/shared/layout/scaffold-page";

describe("SignInScaffoldFlow", () => {
  it("shows the auth-required reason and preserves the next path", () => {
    const element = SignInScaffoldFlow({
      nextPath: "/dashboard",
      reason: "auth_required",
    });

    expect(element.type).toBe(ScaffoldPage);
    expect(element.props).toMatchObject({
      title: "Sign in",
      module: "identity",
      description:
        "Sign in is required before you can continue. After sign-in, continue to /dashboard.",
    });
  });

  it("shows the admin-required reason when admin access is denied", () => {
    const element = SignInScaffoldFlow({
      nextPath: "/admin/dashboard",
      reason: "admin_required",
    });

    expect(element.props.description).toBe(
      "Administrator access is required to open that route. After sign-in, continue to /admin/dashboard.",
    );
  });
});