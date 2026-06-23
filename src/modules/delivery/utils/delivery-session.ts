const DELIVERY_SESSION_STORAGE_KEY = "delivery.request-session-ids";

export function readDeliverySessionIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(DELIVERY_SESSION_STORAGE_KEY);
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

export function rememberDeliverySessionId(requestId: string): string[] {
  const nextIds = [requestId, ...readDeliverySessionIds().filter((id) => id !== requestId)].slice(0, 10);

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(DELIVERY_SESSION_STORAGE_KEY, JSON.stringify(nextIds));
  }

  return nextIds;
}
