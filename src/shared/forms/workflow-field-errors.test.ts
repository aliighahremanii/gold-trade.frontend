import { describe, expect, it } from "vitest";

import { clearFieldError, hasFieldErrors } from "@/shared/forms/workflow-field-errors";

describe("workflow field errors", () => {
  it("clears individual field errors", () => {
    expect(clearFieldError({ amount: "Required", bankAccountReference: "Required" }, "amount")).toEqual({
      bankAccountReference: "Required",
    });
  });

  it("detects when any field errors remain", () => {
    expect(hasFieldErrors({ amount: "Required" })).toBe(true);
    expect(hasFieldErrors({})).toBe(false);
  });
});
