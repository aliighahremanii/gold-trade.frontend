export function isResolvableMismatchStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();

  return (
    normalized === "open" ||
    normalized === "pending" ||
    normalized === "assigned" ||
    normalized === "manual_review" ||
    normalized === "manual_review_required" ||
    normalized === "unknown"
  );
}

export function isTerminalRunStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();

  return (
    normalized === "completed" ||
    normalized === "failed" ||
    normalized === "cancelled" ||
    normalized === "resolved"
  );
}
