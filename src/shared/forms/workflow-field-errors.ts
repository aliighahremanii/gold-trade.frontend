export type WorkflowFieldErrors = Partial<Record<string, string>>;

export function clearFieldError(
  errors: WorkflowFieldErrors,
  field: string,
): WorkflowFieldErrors {
  if (!errors[field]) {
    return errors;
  }

  const next = { ...errors };

  delete next[field];

  return next;
}

export function hasFieldErrors(errors: WorkflowFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
