const TERMINAL_ORDER_STATUSES = new Set([
  "completed",
  "settled",
  "failed",
  "cancelled",
  "canceled",
  "rejected",
  "expired",
]);

const SUCCESS_ORDER_STATUSES = new Set(["completed", "settled"]);

const MANUAL_REVIEW_ORDER_STATUSES = new Set([
  "manual_review",
  "manual_review_required",
  "pending_approval",
  "awaiting_approval",
]);

const SETTLEMENT_PENDING_STATUSES = new Set([
  "settlement_pending",
  "pending_settlement",
  "executing",
  "balance_locked",
]);

const SETTLEMENT_FAILED_STATUSES = new Set(["settlement_failed", "failed_settlement"]);

export function normalizeOrderStatus(status: string): string {
  return status.trim().toLowerCase();
}

export function isTerminalOrderStatus(status: string): boolean {
  return TERMINAL_ORDER_STATUSES.has(normalizeOrderStatus(status));
}

export function isSuccessfulOrderStatus(status: string): boolean {
  return SUCCESS_ORDER_STATUSES.has(normalizeOrderStatus(status));
}

export function isManualReviewOrderStatus(status: string): boolean {
  return MANUAL_REVIEW_ORDER_STATUSES.has(normalizeOrderStatus(status));
}

export function isSettlementPendingOrderStatus(status: string): boolean {
  const normalized = normalizeOrderStatus(status);
  return SETTLEMENT_PENDING_STATUSES.has(normalized) || normalized.includes("settlement_pending");
}

export function isSettlementFailedOrderStatus(status: string): boolean {
  const normalized = normalizeOrderStatus(status);
  return SETTLEMENT_FAILED_STATUSES.has(normalized) || normalized.includes("settlement_failed");
}

export function getOrderWorkflowLabel(status: string): string {
  const normalized = normalizeOrderStatus(status);

  if (isSuccessfulOrderStatus(normalized)) {
    return "Settled";
  }

  if (isSettlementFailedOrderStatus(normalized)) {
    return "Settlement failed";
  }

  if (isManualReviewOrderStatus(normalized)) {
    return "Manual review required";
  }

  if (isSettlementPendingOrderStatus(normalized)) {
    return "Settlement pending";
  }

  if (normalized === "failed") {
    return "Failed";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled";
  }

  return status;
}
