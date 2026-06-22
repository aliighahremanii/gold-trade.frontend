import { describe, expect, it } from "vitest";

import {
  OTP_CHANNEL,
  OTP_PURPOSE,
  buildVerifyPageSearchParams,
  normalizeOtpChannel,
  normalizeOtpPurpose,
} from "@/modules/identity/utils/otp-contract";

describe("normalizeOtpPurpose", () => {
  it("maps legacy frontend purpose values to backend enum strings", () => {
    expect(normalizeOtpPurpose("mobile_verification")).toBe(OTP_PURPOSE.verifyMobile);
    expect(normalizeOtpPurpose("email_verification")).toBe(OTP_PURPOSE.verifyEmail);
  });

  it("keeps canonical backend purpose strings", () => {
    expect(normalizeOtpPurpose("VerifyMobile")).toBe(OTP_PURPOSE.verifyMobile);
    expect(normalizeOtpPurpose("VerifyEmail")).toBe(OTP_PURPOSE.verifyEmail);
  });

  it("defaults by channel when purpose is missing", () => {
    expect(normalizeOtpPurpose(undefined, OTP_CHANNEL.email)).toBe(OTP_PURPOSE.verifyEmail);
    expect(normalizeOtpPurpose(undefined, OTP_CHANNEL.sms)).toBe(OTP_PURPOSE.verifyMobile);
  });
});

describe("buildVerifyPageSearchParams", () => {
  it("uses backend purpose strings in verify URLs", () => {
    expect(
      buildVerifyPageSearchParams({
        channel: OTP_CHANNEL.sms,
        purpose: OTP_PURPOSE.verifyMobile,
        nextPath: "/dashboard",
      }),
    ).toBe("/verify?channel=sms&purpose=VerifyMobile&next=%2Fdashboard");
  });
});

describe("normalizeOtpChannel", () => {
  it("normalizes email channel", () => {
    expect(normalizeOtpChannel("email")).toBe(OTP_CHANNEL.email);
    expect(normalizeOtpChannel("sms")).toBe(OTP_CHANNEL.sms);
  });
});
