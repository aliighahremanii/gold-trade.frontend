import { describe, expect, it } from "vitest";

import { getOtpErrorGuidance } from "@/modules/identity/utils/otp-error-guidance";
import type { NormalizedApiError } from "@/shared/errors";

function createError(code: string): NormalizedApiError {
  return {
    kind: "authentication_error",
    status: 401,
    code,
    message: "The provided verification code is invalid.",
    fieldErrors: [],
  };
}

describe("getOtpErrorGuidance", () => {
  it("explains stale codes after resend on verify failures", () => {
    expect(getOtpErrorGuidance(createError("Identity.OtpInvalid"), "verify")).toContain(
      "most recent message",
    );
  });

  it("explains send-phase OTP failures separately", () => {
    expect(getOtpErrorGuidance(createError("Identity.OtpInvalid"), "send")).toContain(
      "before a code could be sent",
    );
  });
});
