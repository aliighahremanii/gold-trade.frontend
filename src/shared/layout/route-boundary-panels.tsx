"use client";

type RouteErrorPanelProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteErrorPanel({ error, reset }: RouteErrorPanelProps) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Error</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Something went wrong
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          This page could not be rendered. Retry or return to a safe route. No financial action was
          completed.
        </p>
        {error.message ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error.message}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        Try again
      </button>
    </section>
  );
}
