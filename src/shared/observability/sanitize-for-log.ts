const SENSITIVE_KEY_PATTERN =
  /(password|token|secret|authorization|otp|code|refresh|session|cookie|national|bank|iban|card|cvv|pin)/i;

const REDACTED_VALUE = "[redacted]";

export function isSensitiveLogKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key);
}

export function sanitizeForLog<T>(value: T): T {
  return sanitizeValue(value) as T;
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value !== "object" || value === null) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      isSensitiveLogKey(key) ? REDACTED_VALUE : sanitizeValue(nestedValue),
    ]),
  );
}
