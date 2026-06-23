import { formatPricingTimestamp } from "@/modules/pricing/utils/format-price-amount";
import { formatMarketStatusLabel } from "@/modules/pricing/utils/market-status";
import type { MarketPricingStatusDetail } from "@/modules/pricing/api/use-market-pricing";

type MarketStatusSummaryPanelProps = {
  status: MarketPricingStatusDetail;
};

export function MarketStatusSummaryPanel({ status }: MarketStatusSummaryPanelProps) {
  return (
    <section
      aria-label="Current market pricing status"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Current market status</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {status.market_symbol} · backend pricing status
        </p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Status</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-50">
            {formatMarketStatusLabel(status.status)}
            <span className="ml-2 font-mono text-xs text-zinc-500">({status.status})</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Updated at</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatPricingTimestamp(status.updated_at)}</dd>
        </div>
        {status.updated_by ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Updated by</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{status.updated_by}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
