import type { ExecutionDetail } from "@/modules/liquidity/api/use-executions";
import { formatTimestamp } from "@/shared/utils/format-timestamp";
import { formatTradeAmount } from "@/modules/trading/utils/format-trade-amount";

type ProviderExecutionPanelProps = {
  execution: ExecutionDetail;
};

export function ProviderExecutionPanel({ execution }: ProviderExecutionPanelProps) {
  return (
    <section
      aria-label="Provider execution"
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Provider execution</h3>
        <span className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
          {execution.status}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Provider</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{execution.provider_code}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Market</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{execution.market_symbol}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Requested at</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">
            {formatTimestamp(execution.requested_at)}
          </dd>
        </div>
        {execution.submitted_at ? (
          <div>
            <dt className="text-zinc-500">Submitted at</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {formatTimestamp(execution.submitted_at)}
            </dd>
          </div>
        ) : null}
        {execution.completed_at ? (
          <div>
            <dt className="text-zinc-500">Completed at</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">
              {formatTimestamp(execution.completed_at)}
            </dd>
          </div>
        ) : null}
        {execution.quote_amount !== undefined ? (
          <div>
            <dt className="text-zinc-500">Quote amount</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">
              {formatTradeAmount("IRR", execution.quote_amount)}
            </dd>
          </div>
        ) : null}
        {execution.provider_reference ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Provider reference</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {execution.provider_reference}
            </dd>
          </div>
        ) : null}
        {execution.failure_reason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{execution.failure_reason}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
