export const OTP_CODE_MIN_LENGTH = 4;
export const OTP_CODE_MAX_LENGTH = 8;
/** Fallback validity window when backend `expiresAt` is missing or already elapsed. */
export const OTP_CHALLENGE_TTL_MS = 5 * 60 * 1000;
const EXPIRY_GRACE_MS = 5_000;

export function parseOtpExpiresAt(expiresAt: string) {
  const normalized = expiresAt.replace(/(\.\d{3})\d+/, "$1");
  const parsed = Date.parse(normalized);

  return Number.isNaN(parsed) ? null : parsed;
}

export function resolveOtpExpiresAt(expiresAt: string, now = Date.now()) {
  const parsed = parseOtpExpiresAt(expiresAt);

  if (parsed === null || parsed <= now + EXPIRY_GRACE_MS) {
    return new Date(now + OTP_CHALLENGE_TTL_MS).toISOString();
  }

  return new Date(parsed).toISOString();
}

export function isOtpChallengeExpired(expiresAt: string | null, now = Date.now()) {
  if (!expiresAt) {
    return false;
  }

  const parsed = parseOtpExpiresAt(expiresAt);

  if (parsed === null) {
    return false;
  }

  return parsed <= now;
}

export function getOtpChallengeTimeRemainingMs(expiresAt: string | null, now = Date.now()) {
  if (!expiresAt) {
    return null;
  }

  const parsed = parseOtpExpiresAt(expiresAt);

  if (parsed === null) {
    return null;
  }

  return Math.max(0, parsed - now);
}

export function parseRetryAfterSeconds(message: string) {
  const match = message.match(/retry in (\d+)\s*seconds?/i);

  if (!match?.[1]) {
    return null;
  }

  const seconds = Number.parseInt(match[1], 10);

  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function maskPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 4) {
    return value;
  }

  const suffix = digits.slice(-4);

  return `***${suffix}`;
}

export function maskEmail(value: string) {
  const [localPart, domain] = value.split("@");

  if (!localPart || !domain) {
    return value;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? ""}***@${domain}`;
  }

  return `${localPart.slice(0, 2)}***@${domain}`;
}

export function sanitizeOtpCodeInput(value: string) {
  return value.replace(/\D/g, "").slice(0, OTP_CODE_MAX_LENGTH);
}

export function isValidOtpCode(value: string) {
  const normalized = value.trim();

  return (
    normalized.length >= OTP_CODE_MIN_LENGTH && normalized.length <= OTP_CODE_MAX_LENGTH
  );
}
