import type { NormalizedApiError } from "@/shared/errors";

type AuthErrorAlertProps = {
  error: NormalizedApiError | null;
};

const kindCopy: Partial<Record<NormalizedApiError["kind"], string>> = {
  authentication_error: "Check your credentials and try again.",
  rate_limited: "Too many attempts. Wait a moment before trying again.",
  conflict: "An account with these details already exists.",
  validation_error: "Fix the highlighted fields and try again.",
};

export function AuthErrorAlert({ error }: AuthErrorAlertProps) {
  if (!error) {
    return null;
  }

  const guidance = kindCopy[error.kind];

  return (
    <div
      role="alert"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
    >
      <p className="font-medium">{error.message}</p>
      {guidance ? <p className="mt-1">{guidance}</p> : null}
      {error.fieldErrors.length > 0 ? (
        <ul className="mt-2 list-disc pl-5">
          {error.fieldErrors.map((fieldError) => (
            <li key={`${fieldError.code ?? "field"}-${fieldError.message}`}>
              {fieldError.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
