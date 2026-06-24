type OperationReferenceProps = {
  reference?: string | null;
  label?: string;
};

export function OperationReference({
  reference,
  label = "Reference for support",
}: OperationReferenceProps) {
  if (!reference?.trim()) {
    return null;
  }

  return (
    <p className="mt-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
      {label}: {reference}
    </p>
  );
}
