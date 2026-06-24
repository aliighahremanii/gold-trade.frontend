import type { ReconciliationRunView } from "@/modules/reconciliation/mappers/map-reconciliation-views";

type ReconciliationRunDetailPanelProps = {
  run: ReconciliationRunView;
};

export function ReconciliationRunDetailPanel({ run }: ReconciliationRunDetailPanelProps) {
  return (
    <section
      aria-label="Reconciliation run detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reconciliation run</h2>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{run.id}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Type</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{run.runTypeLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{run.statusLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Matched count</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{run.matchedCount ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Mismatch count</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{run.mismatchCount ?? "—"}</dd>
        </div>
        {run.scopeUserId ? (
          <div>
            <dt className="text-zinc-500">Scope user</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{run.scopeUserId}</dd>
          </div>
        ) : null}
        {run.scopeAssetCode ? (
          <div>
            <dt className="text-zinc-500">Scope asset</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{run.scopeAssetCode}</dd>
          </div>
        ) : null}
        {run.scopeMarketSymbol ? (
          <div>
            <dt className="text-zinc-500">Scope market</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{run.scopeMarketSymbol}</dd>
          </div>
        ) : null}
        {run.correlationId ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Correlation ID</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{run.correlationId}</dd>
          </div>
        ) : null}
        {run.summary ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Summary</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{run.summary}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-zinc-500">Started</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{run.startedAtLabel ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Completed</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{run.completedAtLabel ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}
