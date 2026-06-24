import type { NormalizedApiError } from "@/shared/errors/api-error";
import { OperationReference } from "@/shared/ui/operation-reference";

type ApiErrorAlertProps = {
  error: NormalizedApiError | null;
};

export function ApiErrorAlert({ error }: ApiErrorAlertProps) {
  if (!error) {
    return null;
  }

  const isWarning = error.status === 404 || error.status === 409;

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
      <OperationReference reference={error.operationReference} />
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
