import type { components as IdentityComponents } from "@/generated/api/identity";

import { isEmailVerificationRequired, shouldPromptForEmailVerification } from "@/modules/identity/config/verification-requirements";
import {
  OTP_CHANNEL,
  OTP_PURPOSE,
  buildVerifyPageSearchParams,
  normalizeOtpChannel,
  normalizeOtpPurpose,
  type OtpChannel,
} from "@/modules/identity/utils/otp-contract";

type VerificationUser = Pick<
  IdentityComponents["schemas"]["CurrentUserResponse"],
  "isMobileVerified" | "isEmailVerified"
>;

export function getPendingVerificationPath(user: VerificationUser, nextPath: string) {
  if (!user.isMobileVerified) {
    return buildVerifyPageSearchParams({
      channel: OTP_CHANNEL.sms,
      purpose: OTP_PURPOSE.verifyMobile,
      nextPath,
    });
  }

  if (isEmailVerificationRequired() && !user.isEmailVerified) {
    return buildVerifyPageSearchParams({
      channel: OTP_CHANNEL.email,
      purpose: OTP_PURPOSE.verifyEmail,
      nextPath,
    });
  }

  return null;
}

export function getNextVerificationStepPath(user: VerificationUser, nextPath: string) {
  if (!user.isMobileVerified) {
    return buildVerifyPageSearchParams({
      channel: OTP_CHANNEL.sms,
      purpose: OTP_PURPOSE.verifyMobile,
      nextPath,
    });
  }

  if (shouldPromptForEmailVerification() && !user.isEmailVerified) {
    return buildVerifyPageSearchParams({
      channel: OTP_CHANNEL.email,
      purpose: OTP_PURPOSE.verifyEmail,
      nextPath,
    });
  }

  return nextPath;
}

export function getVerifiedChannelRedirectPath(
  user: VerificationUser,
  channel: OtpChannel,
  nextPath: string,
  options?: { mobileVerificationAcknowledged?: boolean },
) {
  const effectiveUser = {
    ...user,
    isMobileVerified:
      user.isMobileVerified || (options?.mobileVerificationAcknowledged ?? false),
  };

  if (channel === OTP_CHANNEL.sms && effectiveUser.isMobileVerified) {
    return getNextVerificationStepPath(effectiveUser, nextPath);
  }

  if (channel === OTP_CHANNEL.email && !effectiveUser.isMobileVerified) {
    return buildVerifyPageSearchParams({
      channel: OTP_CHANNEL.sms,
      purpose: OTP_PURPOSE.verifyMobile,
      nextPath,
    });
  }

  if (channel === OTP_CHANNEL.email && user.isEmailVerified) {
    return nextPath;
  }

  return null;
}

export function resolvePostVerificationPath(user: VerificationUser, nextPath: string) {
  return getNextVerificationStepPath(user, nextPath);
}

export function applyCompletedOtpVerification(user: VerificationUser, verifiedChannel: OtpChannel) {
  return {
    isMobileVerified: user.isMobileVerified || verifiedChannel === OTP_CHANNEL.sms,
    isEmailVerified: user.isEmailVerified || verifiedChannel === OTP_CHANNEL.email,
  };
}

export function resolvePostOtpVerificationPath(
  user: VerificationUser,
  verifiedChannel: OtpChannel,
  nextPath: string,
) {
  return getNextVerificationStepPath(
    applyCompletedOtpVerification(user, verifiedChannel),
    nextPath,
  );
}

export function buildVerifySignInHref(input: {
  channel?: string;
  purpose?: string;
  nextPath?: string;
}) {
  const destinationPath = input.nextPath ?? "/dashboard";

  if (isTotpVerificationPurpose(input.purpose)) {
    const params = new URLSearchParams({
      next: `/verify?purpose=totp&next=${encodeURIComponent(destinationPath)}`,
      reason: "auth_required",
    });

    return `/sign-in?${params.toString()}`;
  }

  const verifyPath = buildVerifyPageSearchParams({
    channel: normalizeOtpChannel(input.channel),
    purpose: normalizeOtpPurpose(input.purpose, input.channel),
    nextPath: destinationPath,
  });
  const params = new URLSearchParams({
    next: verifyPath,
    reason: "auth_required",
  });

  return `/sign-in?${params.toString()}`;
}

export function isTotpVerificationPurpose(purpose?: string) {
  return purpose?.toLowerCase() === "totp";
}
