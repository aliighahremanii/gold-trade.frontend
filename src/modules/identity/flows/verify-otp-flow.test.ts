import { describe, expect, it } from "vitest";

import { isOtpChallengeExpired } from "@/modules/identity/utils/otp-utils";

describe("isOtpChallengeExpired", () => {
  it("returns false when there is no challenge expiry", () => {
    expect(isOtpChallengeExpired(null, Date.parse("2026-06-22T10:00:00.000Z"))).toBe(false);
  });

  it("returns false before the expiry timestamp", () => {
    expect(
      isOtpChallengeExpired(
        "2026-06-22T10:05:00.000Z",
        Date.parse("2026-06-22T10:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("returns true at or after the expiry timestamp", () => {
    expect(
      isOtpChallengeExpired(
        "2026-06-22T10:05:00.000Z",
        Date.parse("2026-06-22T10:05:00.000Z"),
      ),
    ).toBe(true);
  });
});