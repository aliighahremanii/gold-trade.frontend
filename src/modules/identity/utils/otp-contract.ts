/**
 * Values aligned with backend identity `OtpPurpose.String()` and `ParseOtpPurpose`.
 * OpenAPI currently types these as plain strings; use these constants in client requests.
 */
export const OTP_CHANNEL = {
  sms: "sms",
  email: "email",
} as const;

export const OTP_PURPOSE = {
  signIn: "SignIn",
  signUp: "SignUp",
  verifyMobile: "VerifyMobile",
  verifyEmail: "VerifyEmail",
  resetPassword: "ResetPassword",
} as const;

export type OtpChannel = (typeof OTP_CHANNEL)[keyof typeof OTP_CHANNEL];
export type OtpPurpose = (typeof OTP_PURPOSE)[keyof typeof OTP_PURPOSE];

const PURPOSE_ALIASES: Record<string, OtpPurpose> = {
  signin: OTP_PURPOSE.signIn,
  signup: OTP_PURPOSE.signUp,
  verifymobile: OTP_PURPOSE.verifyMobile,
  mobileverification: OTP_PURPOSE.verifyMobile,
  verifyemail: OTP_PURPOSE.verifyEmail,
  emailverification: OTP_PURPOSE.verifyEmail,
  resetpassword: OTP_PURPOSE.resetPassword,
  verification: OTP_PURPOSE.verifyMobile,
};

export function normalizeOtpPurpose(purpose?: string, channel?: string): OtpPurpose {
  if (!purpose) {
    return channel === OTP_CHANNEL.email ? OTP_PURPOSE.verifyEmail : OTP_PURPOSE.verifyMobile;
  }

  const canonical = PURPOSE_ALIASES[purpose.toLowerCase().replace(/[_-]/g, "")];

  if (canonical) {
    return canonical;
  }

  if (purpose === OTP_PURPOSE.signIn) return OTP_PURPOSE.signIn;
  if (purpose === OTP_PURPOSE.signUp) return OTP_PURPOSE.signUp;
  if (purpose === OTP_PURPOSE.verifyMobile) return OTP_PURPOSE.verifyMobile;
  if (purpose === OTP_PURPOSE.verifyEmail) return OTP_PURPOSE.verifyEmail;
  if (purpose === OTP_PURPOSE.resetPassword) return OTP_PURPOSE.resetPassword;

  return channel === OTP_CHANNEL.email ? OTP_PURPOSE.verifyEmail : OTP_PURPOSE.verifyMobile;
}

export function normalizeOtpChannel(channel?: string): OtpChannel {
  if (channel?.toLowerCase() === OTP_CHANNEL.email) {
    return OTP_CHANNEL.email;
  }

  return OTP_CHANNEL.sms;
}

export function buildVerifyPageSearchParams(input: {
  channel: OtpChannel;
  purpose: OtpPurpose;
  nextPath: string;
}) {
  const params = new URLSearchParams({
    channel: input.channel,
    purpose: input.purpose,
    next: input.nextPath,
  });

  return `/verify?${params.toString()}`;
}
