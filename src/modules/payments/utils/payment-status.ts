export function normalizePaymentStatus(status: string): string {
  return status.trim().toLowerCase();
}

const TERMINAL_DEPOSIT_STATUSES = new Set([
  "completed",
  "confirmed",
  "failed",
  "cancelled",
  "canceled",
  "rejected",
  "expired",
]);

const SUCCESSFUL_DEPOSIT_STATUSES = new Set(["completed", "confirmed"]);

const PENDING_DEPOSIT_STATUSES = new Set([
  "pending",
  "processing",
  "awaiting_payment",
  "awaiting_callback",
  "gateway_pending",
]);

const TERMINAL_WITHDRAWAL_STATUSES = new Set([
  "completed",
  "failed",
  "cancelled",
  "canceled",
  "rejected",
]);

const SUCCESSFUL_WITHDRAWAL_STATUSES = new Set(["completed"]);

const PENDING_WITHDRAWAL_STATUSES = new Set([
  "pending",
  "processing",
  "pending_approval",
  "awaiting_approval",
  "approved",
  "locked",
  "balance_locked",
]);

const MANUAL_REVIEW_WITHDRAWAL_STATUSES = new Set([
  "manual_review",
  "manual_review_required",
  "pending_approval",
  "awaiting_approval",
]);

const CANCELLABLE_WITHDRAWAL_STATUSES = new Set([
  "pending",
  "processing",
  "pending_approval",
  "awaiting_approval",
  "locked",
  "balance_locked",
]);

export function isTerminalDepositStatus(status: string): boolean {
  return TERMINAL_DEPOSIT_STATUSES.has(normalizePaymentStatus(status));
}

export function isSuccessfulDepositStatus(status: string): boolean {
  return SUCCESSFUL_DEPOSIT_STATUSES.has(normalizePaymentStatus(status));
}

export function isPendingDepositStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);
  return PENDING_DEPOSIT_STATUSES.has(normalized) || normalized.includes("pending");
}

export function isFailedDepositStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);
  return normalized === "failed" || normalized.includes("failed");
}

export function isTerminalWithdrawalStatus(status: string): boolean {
  return TERMINAL_WITHDRAWAL_STATUSES.has(normalizePaymentStatus(status));
}

export function isSuccessfulWithdrawalStatus(status: string): boolean {
  return SUCCESSFUL_WITHDRAWAL_STATUSES.has(normalizePaymentStatus(status));
}

export function isPendingWithdrawalStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);
  return PENDING_WITHDRAWAL_STATUSES.has(normalized) || normalized.includes("pending");
}

export function isManualReviewWithdrawalStatus(status: string): boolean {
  return MANUAL_REVIEW_WITHDRAWAL_STATUSES.has(normalizePaymentStatus(status));
}

export function isFailedWithdrawalStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);
  return normalized === "failed" || normalized === "rejected" || normalized.includes("failed");
}

export function isCancellableWithdrawalStatus(status: string): boolean {
  return CANCELLABLE_WITHDRAWAL_STATUSES.has(normalizePaymentStatus(status));
}

export function getDepositStatusLabel(status: string): string {
  const normalized = normalizePaymentStatus(status);

  if (isSuccessfulDepositStatus(normalized)) {
    return "Completed";
  }

  if (isFailedDepositStatus(normalized)) {
    return "Failed";
  }

  if (isPendingDepositStatus(normalized)) {
    return "Pending";
  }

  return status;
}

export function isConfirmableDepositStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);

  if (isTerminalDepositStatus(normalized) || isSuccessfulDepositStatus(normalized)) {
    return false;
  }

  return (
    isPendingDepositStatus(normalized) ||
    normalized.includes("awaiting") ||
    normalized.includes("manual")
  );
}

export function getWithdrawalStatusLabel(status: string): string {
  const normalized = normalizePaymentStatus(status);

  if (isSuccessfulWithdrawalStatus(normalized)) {
    return "Completed";
  }

  if (isManualReviewWithdrawalStatus(normalized)) {
    return "Manual review required";
  }

  if (normalized === "failed" || normalized === "rejected") {
    return normalized === "rejected" ? "Rejected" : "Failed";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "Cancelled";
  }

  if (isPendingWithdrawalStatus(normalized)) {
    return "Pending";
  }

  return status;
}

export function isApprovableWithdrawalStatus(status: string): boolean {
  return isManualReviewWithdrawalStatus(status);
}

export function isCompletableWithdrawalStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);
  return normalized === "approved";
}

export function isRejectableWithdrawalStatus(status: string): boolean {
  const normalized = normalizePaymentStatus(status);

  if (isTerminalWithdrawalStatus(normalized)) {
    return false;
  }

  return (
    isManualReviewWithdrawalStatus(normalized) ||
    isPendingWithdrawalStatus(normalized) ||
    normalized === "approved"
  );
}
