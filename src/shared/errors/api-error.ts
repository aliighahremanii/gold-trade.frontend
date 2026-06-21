export type ApiErrorKind =
  | "validation_error"
  | "authentication_error"
  | "authorization_error"
  | "not_found"
  | "conflict"
  | "quote_expired"
  | "insufficient_balance"
  | "manual_review_required"
  | "provider_unavailable"
  | "settlement_failed"
  | "payment_pending"
  | "payment_failed"
  | "rate_limited"
  | "unknown_error";

export type ProblemFieldError = {
  code?: string;
  message: string;
};

export type ProblemResponse = {
  code?: string;
  message: string;
  errors?: ProblemFieldError[];
};

export type NormalizedApiError = {
  kind: ApiErrorKind;
  status: number;
  code?: string;
  message: string;
  fieldErrors: ProblemFieldError[];
  raw?: unknown;
};

export const KNOWN_PROBLEM_CODES: Record<string, ApiErrorKind> = {
  validation_error: "validation_error",
  unauthorized: "authentication_error",
  authentication_failed: "authentication_error",
  forbidden: "authorization_error",
  not_found: "not_found",
  conflict: "conflict",
  quote_expired: "quote_expired",
  insufficient_balance: "insufficient_balance",
  manual_review_required: "manual_review_required",
  provider_unavailable: "provider_unavailable",
  settlement_failed: "settlement_failed",
  payment_pending: "payment_pending",
  payment_failed: "payment_failed",
  too_many_requests: "rate_limited",
};
