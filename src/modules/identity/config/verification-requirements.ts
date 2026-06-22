/**
 * Email OTP delivery is not production-ready yet. Mobile verification is required
 * before customer routes; email verification is offered after mobile but can be skipped.
 */
export const EMAIL_VERIFICATION_REQUIRED = false;

/** Prompt users to verify email after mobile, with an explicit skip option. */
export const EMAIL_VERIFICATION_PROMPTED = true;

export function isEmailVerificationRequired() {
  return EMAIL_VERIFICATION_REQUIRED;
}

export function shouldPromptForEmailVerification() {
  return EMAIL_VERIFICATION_PROMPTED;
}
