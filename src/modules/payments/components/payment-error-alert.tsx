import type { NormalizedApiError } from "@/shared/errors";

type PaymentErrorAlertProps = {
  error: NormalizedApiError | null;
};

function getGuidance(error: NormalizedApiError): string | null {
  switch (error.kind) {
    case "insufficient_balance":
      return "Reduce the withdrawal amount or wait for pending operations to complete.";
    case "manual_review_required":
      return "This withdrawal requires manual review before payout.";
    case "payment_pending":
      return "The payment is still pending backend confirmation.";
    case "payment_failed":
      return "The payment failed. You can start a new deposit when ready.";
    case "provider_unavailable":
      return "The payment provider is unavailable. Try again later.";
    default:
      return null;
  }
}

export function PaymentErrorAlert({ error }: PaymentErrorAlertProps) {
  if (!error) {
    return null;
  }

  const guidance = getGuidance(error);
  const isWarning =
    error.kind === "manual_review_required" ||
    error.kind === "payment_pending" ||
    error.kind === "rate_limited";

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
