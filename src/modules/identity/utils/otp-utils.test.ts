import { describe, expect, it } from "vitest";

import {
  OTP_CHALLENGE_TTL_MS,
  isOtpChallengeExpired,
  isValidOtpCode,
  maskEmail,
  maskPhoneNumber,
  parseOtpExpiresAt,
  parseRetryAfterSeconds,
  resolveOtpExpiresAt,
  sanitizeOtpCodeInput,
} from "@/modules/identity/utils/otp-utils";

describe("otp-utils", () => {
  it("parses retry-after seconds from backend messages", () => {
    expect(parseRetryAfterSeconds("Too many OTP attempts. Please retry in 14 seconds.")).toBe(14);
  });

  it("masks phone numbers and emails for display", () => {
    expect(maskPhoneNumber("09112303176")).toBe("***3176");
    expect(maskEmail("user@example.com")).toBe("us***@example.com");
  });

  it("sanitizes OTP input to numeric characters", () => {
    expect(sanitizeOtpCodeInput("12ab3456")).toBe("123456");
    expect(isValidOtpCode("1234")).toBe(true);
    expect(isValidOtpCode("12")).toBe(false);
  });

  it("parses backend expiry timestamps with long fractional seconds", () => {
    const parsed = parseOtpExpiresAt("2026-06-22T14:16:49.57027025Z");

    expect(parsed).toBe(Date.parse("2026-06-22T14:16:49.570Z"));
  });

  it("falls back to a local TTL when backend expiry is already elapsed", () => {
    const now = Date.parse("2026-06-22T14:20:00.000Z");
    const resolved = resolveOtpExpiresAt("2026-06-22T14:16:49.57027025Z", now);

    expect(resolved).toBe(new Date(now + OTP_CHALLENGE_TTL_MS).toISOString());
    expect(isOtpChallengeExpired(resolved, now)).toBe(false);
  });
});
