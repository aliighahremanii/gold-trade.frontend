import { describe, expect, it } from "vitest";

import { OTP_CHANNEL } from "@/modules/identity/utils/otp-contract";
import {
  getNextVerificationStepPath,
  getPendingVerificationPath,
  getVerifiedChannelRedirectPath,
  resolvePostOtpVerificationPath,
  resolvePostVerificationPath,
} from "@/modules/identity/utils/verification-redirect";

describe("verification redirect", () => {
  it("routes unverified users to the next required verification step", () => {
    expect(
      getPendingVerificationPath(
        { isMobileVerified: false, isEmailVerified: false },
        "/dashboard",
      ),
    ).toBe("/verify?channel=sms&purpose=VerifyMobile&next=%2Fdashboard");
  });

  it("does not block customer routes when only email is unverified", () => {
    expect(
      getPendingVerificationPath(
        { isMobileVerified: true, isEmailVerified: false },
        "/dashboard",
      ),
    ).toBeNull();
  });

  it("offers optional email verification after mobile is complete", () => {
    expect(
      getNextVerificationStepPath(
        { isMobileVerified: true, isEmailVerified: false },
        "/dashboard",
      ),
    ).toBe("/verify?channel=email&purpose=VerifyEmail&next=%2Fdashboard");
  });

  it("returns the destination when verification is complete", () => {
    expect(
      resolvePostVerificationPath(
        { isMobileVerified: true, isEmailVerified: true },
        "/dashboard",
      ),
    ).toBe("/dashboard");
  });

  it("advances past the OTP step that just succeeded even when /me is stale", () => {
    expect(
      resolvePostOtpVerificationPath(
        { isMobileVerified: false, isEmailVerified: false },
        OTP_CHANNEL.sms,
        "/dashboard",
      ),
    ).toBe("/verify?channel=email&purpose=VerifyEmail&next=%2Fdashboard");

    expect(
      resolvePostOtpVerificationPath(
        { isMobileVerified: true, isEmailVerified: false },
        OTP_CHANNEL.email,
        "/dashboard",
      ),
    ).toBe("/dashboard");
  });

  it("redirects away from completed verification steps", () => {
    expect(
      getVerifiedChannelRedirectPath(
        { isMobileVerified: true, isEmailVerified: false },
        OTP_CHANNEL.sms,
        "/dashboard",
      ),
    ).toBe("/verify?channel=email&purpose=VerifyEmail&next=%2Fdashboard");

    expect(
      getVerifiedChannelRedirectPath(
        { isMobileVerified: false, isEmailVerified: false },
        OTP_CHANNEL.sms,
        "/dashboard",
        { mobileVerificationAcknowledged: true },
      ),
    ).toBe("/verify?channel=email&purpose=VerifyEmail&next=%2Fdashboard");
  });
});
