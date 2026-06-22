import type { InputHTMLAttributes, ReactNode } from "react";

type AuthFormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export function AuthFormField({
  id,
  label,
  error,
  children,
  className,
  ...inputProps
}: AuthFormFieldProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-zinc-800 dark:text-zinc-200">{label}</span>
      {children ?? (
        <input
          id={id}
          className={`rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 ${className ?? ""}`}
          {...inputProps}
        />
      )}
      {error ? <span className="text-red-700 dark:text-red-300">{error}</span> : null}
    </label>
  );
}
