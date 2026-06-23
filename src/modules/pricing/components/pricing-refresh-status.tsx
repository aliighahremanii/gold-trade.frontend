type PricingRefreshStatusProps = {
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  errorMessage?: string;
  lastUpdatedLabel?: string;
  onRefresh: () => void;
};

export function PricingRefreshStatus({
  isLoading,
  isFetching,
  isError,
  errorMessage,
  lastUpdatedLabel,
  onRefresh,
}: PricingRefreshStatusProps) {
  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Pricing data status</p>
          {isLoading ? (
            <p className="text-sm text-zinc-500" aria-live="polite">
              Loading pricing data...
            </p>
          ) : null}
          {!isLoading && lastUpdatedLabel ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
              Last updated {lastUpdatedLabel}
            </p>
          ) : null}
          {isRefreshing ? (
            <p className="text-sm text-zinc-500" aria-live="polite">
              Refreshing pricing data...
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading || isFetching}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Refresh
        </button>
      </div>

      {isError ? (
        <div
          className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
          role="alert"
        >
          <p>{errorMessage ?? "Pricing data could not be loaded."}</p>
        </div>
      ) : null}
    </div>
  );
}
