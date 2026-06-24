export function normalizeDeliveryStatus(status: string): string {
  return status.trim().toLowerCase();
}

const TERMINAL_DELIVERY_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "rejected",
  "failed",
]);

const SUCCESS_DELIVERY_STATUSES = new Set(["completed"]);

const PENDING_DELIVERY_STATUSES = new Set([
  "pending",
  "processing",
  "pending_approval",
  "awaiting_approval",
  "approved",
  "scheduled",
  "balance_locked",
  "locked",
]);

const MANUAL_REVIEW_DELIVERY_STATUSES = new Set([
  "manual_review",
  "manual_review_required",
  "pending_approval",
  "awaiting_approval",
]);

const CANCELLABLE_DELIVERY_STATUSES = new Set([
  "pending",
  "processing",
  "pending_approval",
  "awaiting_approval",
  "approved",
  "scheduled",
  "locked",
  "balance_locked",
]);

export function isTerminalDeliveryStatus(status: string): boolean {
  return TERMINAL_DELIVERY_STATUSES.has(normalizeDeliveryStatus(status));
}

export function isSuccessfulDeliveryStatus(status: string): boolean {
  return SUCCESS_DELIVERY_STATUSES.has(normalizeDeliveryStatus(status));
}

export function isPendingDeliveryStatus(status: string): boolean {
  const normalized = normalizeDeliveryStatus(status);
  return PENDING_DELIVERY_STATUSES.has(normalized) || normalized.includes("pending");
}

export function isManualReviewDeliveryStatus(status: string): boolean {
  return MANUAL_REVIEW_DELIVERY_STATUSES.has(normalizeDeliveryStatus(status));
}

export function isFailedDeliveryStatus(status: string): boolean {
  const normalized = normalizeDeliveryStatus(status);
  return normalized === "failed" || normalized.includes("failed");
}

export function isCancelledDeliveryStatus(status: string): boolean {
  const normalized = normalizeDeliveryStatus(status);
  return normalized === "cancelled" || normalized === "canceled";
}

export function isRejectedDeliveryStatus(status: string): boolean {
  return normalizeDeliveryStatus(status) === "rejected";
}

export function isCancellableDeliveryStatus(status: string): boolean {
  return CANCELLABLE_DELIVERY_STATUSES.has(normalizeDeliveryStatus(status));
}

export function getDeliveryStatusLabel(status: string): string {
  const normalized = normalizeDeliveryStatus(status);

  if (isSuccessfulDeliveryStatus(normalized)) {
    return "Completed";
  }

  if (isManualReviewDeliveryStatus(normalized)) {
    return "Manual review required";
  }

  if (normalized === "scheduled") {
    return "Scheduled";
  }

  if (normalized === "approved") {
    return "Approved";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  if (normalized === "failed") {
    return "Failed";
  }

  if (isPendingDeliveryStatus(normalized)) {
    return "Pending";
  }

  return status;
}

export function isApprovableDeliveryStatus(status: string): boolean {
  return isManualReviewDeliveryStatus(status);
}

export function isSchedulableDeliveryStatus(status: string): boolean {
  return normalizeDeliveryStatus(status) === "approved";
}

export function isCompletableDeliveryStatus(status: string): boolean {
  return normalizeDeliveryStatus(status) === "scheduled";
}

export function isRejectableDeliveryStatus(status: string): boolean {
  const normalized = normalizeDeliveryStatus(status);

  if (isTerminalDeliveryStatus(normalized)) {
    return false;
  }

  return (
    isManualReviewDeliveryStatus(normalized) ||
    isPendingDeliveryStatus(normalized) ||
    normalized === "approved" ||
    normalized === "scheduled"
  );
}
