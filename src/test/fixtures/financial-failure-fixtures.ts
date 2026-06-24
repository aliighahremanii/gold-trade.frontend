import type { NormalizedApiError } from "@/shared/errors";
import { normalizeApiError } from "@/shared/errors";

/** Backend problem responses used to exercise financial failure-state UX. */
export const FINANCIAL_FAILURE_PROBLEMS = {
  quoteExpired: {
    status: 409,
    body: { code: "quote_expired", message: "This quote has expired." },
  },
  insufficientBalance: {
    status: 409,
    body: { code: "insufficient_balance", message: "Insufficient balance for this trade." },
  },
  providerUnavailable: {
    status: 503,
    body: { code: "provider_unavailable", message: "Execution provider is unavailable." },
  },
  settlementFailed: {
    status: 409,
    body: { code: "settlement_failed", message: "Settlement could not complete." },
  },
  paymentPending: {
    status: 409,
    body: { code: "payment_pending", message: "Payment is still pending confirmation." },
  },
  paymentFailed: {
    status: 422,
    body: { code: "payment_failed", message: "Payment failed at the gateway." },
  },
  manualReviewRequired: {
    status: 409,
    body: { code: "manual_review_required", message: "Manual review is required." },
  },
  duplicateSubmit: {
    status: 409,
    body: { code: "conflict", message: "A request with this idempotency key already exists." },
  },
} as const;

export function normalizeFinancialFailureProblem(
  key: keyof typeof FINANCIAL_FAILURE_PROBLEMS,
  fallbackMessage = "Request failed.",
): NormalizedApiError {
  const problem = FINANCIAL_FAILURE_PROBLEMS[key];

  return normalizeApiError({
    status: problem.status,
    body: problem.body,
    fallbackMessage,
  });
}

export const ORDER_FAILURE_STATUSES = {
  settlementPending: "settlement_pending",
  settlementFailed: "settlement_failed",
  manualReview: "manual_review_required",
  providerFailed: "failed",
} as const;

export const PAYMENT_FAILURE_STATUSES = {
  depositPending: "gateway_pending",
  depositFailed: "failed",
  withdrawalPending: "pending_approval",
  withdrawalFailed: "failed",
  withdrawalRejected: "rejected",
  withdrawalCancelled: "cancelled",
} as const;

export const DELIVERY_FAILURE_STATUSES = {
  pending: "pending_approval",
  manualReview: "manual_review_required",
  cancelled: "cancelled",
  rejected: "rejected",
  failed: "failed",
} as const;
