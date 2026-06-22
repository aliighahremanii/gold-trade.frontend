import { describe, expect, it } from "vitest";

import {
  hasSignUpFieldErrors,
  validateSignUpFields,
} from "@/modules/identity/utils/sign-up-validation";

describe("sign-up validation", () => {
  it("accepts valid Iranian mobile and national code values", () => {
    expect(
      validateSignUpFields({
        mobileNumber: "09112303176",
        nationalCode: "0012345678",
      }),
    ).toEqual({});
  });

  it("rejects invalid formats", () => {
    const errors = validateSignUpFields({
      mobileNumber: "9112303176",
      nationalCode: "123",
    });

    expect(hasSignUpFieldErrors(errors)).toBe(true);
    expect(errors.mobileNumber).toBeTruthy();
    expect(errors.nationalCode).toBeTruthy();
  });
});
