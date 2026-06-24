import type { NormalizedApiError } from "@/shared/errors";

type TradeErrorAlertProps = {
  error: NormalizedApiError | null;
};

function getGuidance(error: NormalizedApiError): string | null {
  switch (error.kind) {
    case "quote_expired":
      return "Request a new quote before confirming.";
    case "insufficient_balance":
      return "Deposit funds or reduce the amount, then request a new quote.";
    case "manual_review_required":
      return "Your order requires manual review. Check order status for updates.";
    case "provider_unavailable":
      return "The execution provider is unavailable. Try again later.";
    case "settlement_failed":
      return "Settlement did not complete. Support may need to review this order.";
    case "conflict":
      return "This request was already submitted. Check order status instead of resubmitting.";
    default:
      return null;
  }
}

export function TradeErrorAlert({ error }: TradeErrorAlertProps) {
  if (!error) {
    return null;
  }

  const guidance = getGuidance(error);
  const isWarning =
    error.kind === "manual_review_required" ||
    error.kind === "rate_limited" ||
    error.kind === "conflict";

  return (
    <div
      className={
        isWarning
          ? "rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
          : "rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
      }
      role="alert"
    >
      <p>{error.message}</p>
      {guidance ? <p className="mt-1 text-sm opacity-90">{guidance}</p> : null}
    </div>
  );
}

function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "status" in error &&
    "message" in error
  );
}

export function toNormalizedApiError(error: unknown): NormalizedApiError | null {
  return isNormalizedApiError(error) ? error : null;
}
