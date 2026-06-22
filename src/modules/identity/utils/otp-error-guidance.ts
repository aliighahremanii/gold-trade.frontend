import type { NormalizedApiError } from "@/shared/errors";

type OtpErrorPhase = "send" | "verify";

export function getOtpErrorGuidance(error: NormalizedApiError, phase: OtpErrorPhase) {
  if (error.code === "Identity.OtpInvalid" && phase === "verify") {
    return "Use the code from your most recent message. If you requested a new code, earlier messages will no longer work.";
  }

  if (error.code === "Identity.OtpInvalid" && phase === "send") {
    return "The server rejected the verification request before a code could be sent. Try again in a moment or contact support if this continues.";
  }

  if (error.code === "Identity.OtpExpired" && phase === "verify") {
    return "Request a new verification code and enter it before it expires.";
  }

  return undefined;
}
