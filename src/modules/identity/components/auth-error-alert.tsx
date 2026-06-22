import type { NormalizedApiError } from "@/shared/errors";

type AuthErrorAlertProps = {
  error: NormalizedApiError | null;
  guidance?: string;
  variant?: "error" | "warning";
};

const kindCopy: Partial<Record<NormalizedApiError["kind"], string>> = {
  authentication_error: "Check your credentials and try again.",
  conflict: "An account with these details already exists.",
  validation_error: "Fix the highlighted fields and try again.",
};

const variantClasses = {
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100",
} as const;

export function AuthErrorAlert({ error, guidance, variant }: AuthErrorAlertProps) {
  if (!error) {
    return null;
  }

  const resolvedVariant = variant ?? (error.kind === "rate_limited" ? "warning" : "error");
  const resolvedGuidance =
    guidance ?? (error.kind === "rate_limited" ? undefined : kindCopy[error.kind]);

  return (
    <div
      role="alert"
      className={`rounded-md border px-3 py-2 text-sm ${variantClasses[resolvedVariant]}`}
    >
      <p className="font-medium">{error.message}</p>
      {resolvedGuidance ? <p className="mt-1">{resolvedGuidance}</p> : null}
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
