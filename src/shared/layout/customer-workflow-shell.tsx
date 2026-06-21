import type { ReactNode } from "react";

type CustomerWorkflowShellProps = {
  title: string;
  module: string;
  description?: string;
  children?: ReactNode;
};

const defaultDescription =
  "Workflow implementation is planned for a later phase. Financial state will load from backend APIs when available.";

export function CustomerWorkflowShell({
  title,
  module,
  description,
  children,
}: CustomerWorkflowShellProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">{module}</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          {description ?? defaultDescription}
        </p>
      </div>
      {children}
    </section>
  );
}
