import Link from "next/link";

import { MARKET_STATUS_OPTIONS } from "@/modules/pricing/utils/market-status";

type MarketStatusControlsProps = {
  selectedStatus: string;
  currentStatus?: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  onStatusChange: (status: string) => void;
  onSubmit: () => void;
};

export function MarketStatusControls({
  selectedStatus,
  currentStatus,
  isSubmitting,
  isDisabled,
  onStatusChange,
  onSubmit,
}: MarketStatusControlsProps) {
  return (
    <section
      aria-label="Market status controls"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Update market status</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Choose open, closed, or manual-only pricing status. Changes are applied by the backend and may
          affect quote and provider ingest behavior.
        </p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Target status</legend>
          {MARKET_STATUS_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
              <input
                type="radio"
                name="market-status"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={() => onStatusChange(option.value)}
              />
              <span>
                {option.label}
                <span className="ml-2 font-mono text-xs text-zinc-500">({option.value})</span>
              </span>
            </label>
          ))}
        </fieldset>

        {currentStatus && currentStatus === selectedStatus ? (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="status">
            The selected status already matches the current backend status.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || isDisabled || currentStatus === selectedStatus}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {isSubmitting ? "Submitting..." : "Review status change"}
          </button>
          <Link href="/admin/audit" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
            View audit trail
          </Link>
        </div>
      </form>
    </section>
  );
}
