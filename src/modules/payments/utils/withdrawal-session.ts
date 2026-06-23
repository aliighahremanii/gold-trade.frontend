const WITHDRAWAL_SESSION_STORAGE_KEY = "payments.withdrawal-session-ids";

export function readWithdrawalSessionIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(WITHDRAWAL_SESSION_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function rememberWithdrawalSessionId(withdrawalId: string): string[] {
  const nextIds = [withdrawalId, ...readWithdrawalSessionIds().filter((id) => id !== withdrawalId)].slice(
    0,
    10,
  );

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(WITHDRAWAL_SESSION_STORAGE_KEY, JSON.stringify(nextIds));
  }

  return nextIds;
}
