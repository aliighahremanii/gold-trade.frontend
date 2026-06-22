import { describe, expect, it } from "vitest";

import { AuthErrorAlert } from "@/modules/identity/components/auth-error-alert";

describe("AuthErrorAlert", () => {
  it("renders rate-limit guidance", () => {
    const element = AuthErrorAlert({
      error: {
        kind: "rate_limited",
        status: 429,
        message: "Too many attempts.",
        fieldErrors: [],
      },
    });

    expect(element?.props.children).toBeTruthy();
  });

  it("renders nothing when there is no error", () => {
    expect(AuthErrorAlert({ error: null })).toBeNull();
  });
});
