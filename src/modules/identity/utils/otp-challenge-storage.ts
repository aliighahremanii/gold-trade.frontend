import { isOtpChallengeExpired } from "@/modules/identity/utils/otp-utils";

export type StoredOtpChallenge = {
  challengeId: string;
  destination: string;
  expiresAt: string;
  sentAt?: string;
};

function storageKey(channel: string, purpose: string) {
  return `gt_otp_challenge:${channel}:${purpose}`;
}

function autoSendKey(channel: string, purpose: string) {
  return `gt_otp_auto_send:${channel}:${purpose}`;
}

export function shouldSkipAutoSend(channel: string, purpose: string, windowMs = 30_000) {
  if (typeof window === "undefined") {
    return true;
  }

  const raw = window.sessionStorage.getItem(autoSendKey(channel, purpose));

  if (!raw) {
    return false;
  }

  const attemptedAt = Number(raw);

  return Number.isFinite(attemptedAt) && Date.now() - attemptedAt < windowMs;
}

export function markAutoSendAttempt(channel: string, purpose: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(autoSendKey(channel, purpose), String(Date.now()));
}

export function readStoredOtpChallenge(
  channel: string,
  purpose: string,
): StoredOtpChallenge | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(storageKey(channel, purpose));

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredOtpChallenge;

    if (!parsed.challengeId || !parsed.expiresAt) {
      return null;
    }

    if (isOtpChallengeExpired(parsed.expiresAt)) {
      clearStoredOtpChallenge(channel, purpose);
      return null;
    }

    return parsed;
  } catch {
    clearStoredOtpChallenge(channel, purpose);
    return null;
  }
}

export function writeStoredOtpChallenge(
  channel: string,
  purpose: string,
  challenge: StoredOtpChallenge,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(storageKey(channel, purpose), JSON.stringify(challenge));
}

export function clearStoredOtpChallenge(channel: string, purpose: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(storageKey(channel, purpose));
}
