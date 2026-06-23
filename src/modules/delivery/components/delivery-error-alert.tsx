import type { NormalizedApiError } from "@/shared/errors";

type DeliveryErrorAlertProps = {
  error: NormalizedApiError | null;
};

function getGuidance(error: NormalizedApiError): string | null {
  switch (error.kind) {
    case "insufficient_balance":
      return "Reduce the delivery amount or wait for pending wallet operations to complete.";
    case "manual_review_required":
      return "This delivery request requires manual review before scheduling.";
    default:
      return null;
  }
}

export function DeliveryErrorAlert({ error }: DeliveryErrorAlertProps) {
  if (!error) {
    return null;
  }

  const guidance = getGuidance(error);
  const isWarning =
    error.kind === "manual_review_required" ||
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
