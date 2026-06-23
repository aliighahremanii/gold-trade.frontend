export function getQuoteRemainingSeconds(expiresAt: string, now: Date = new Date()): number {
  const expiry = new Date(expiresAt).getTime();

  if (Number.isNaN(expiry)) {
    return 0;
  }

  return Math.max(0, Math.floor((expiry - now.getTime()) / 1000));
}

export function isQuoteExpired(expiresAt: string, now: Date = new Date()): boolean {
  return getQuoteRemainingSeconds(expiresAt, now) === 0;
}

export function formatQuoteCountdown(secondsRemaining: number): string {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
