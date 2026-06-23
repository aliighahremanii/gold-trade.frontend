export function resolveIdempotencyKey(
  currentKey: string | null,
  createKey: () => string,
): string {
  return currentKey ?? createKey();
}

export function idempotencyKeyAfterSuccessfulMutation(): null {
  return null;
}
