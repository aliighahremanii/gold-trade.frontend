import { isResolvableMismatchStatus } from "@/modules/reconciliation/utils/reconciliation-status";
import type { ReconciliationMismatchView } from "@/modules/reconciliation/mappers/map-reconciliation-views";

type ReconciliationMismatchDetailPanelProps = {
  mismatch: ReconciliationMismatchView;
  isSubmitting: boolean;
  onAssign: () => void;
  onResolve: () => void;
};

export function ReconciliationMismatchDetailPanel({
  mismatch,
  isSubmitting,
  onAssign,
  onResolve,
}: ReconciliationMismatchDetailPanelProps) {
  const canOperate = isResolvableMismatchStatus(mismatch.status);

  return (
    <section
      aria-label="Reconciliation mismatch detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reconciliation mismatch</h2>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{mismatch.id}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Type</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{mismatch.mismatchType}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{mismatch.statusLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Expected</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {mismatch.expectedValue ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Actual</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {mismatch.actualValue ?? "—"}
          </dd>
        </div>
        {mismatch.runId ? (
          <div>
            <dt className="text-zinc-500">Run ID</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{mismatch.runId}</dd>
          </div>
        ) : null}
        {mismatch.assignedTo ? (
          <div>
            <dt className="text-zinc-500">Assigned to</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{mismatch.assignedTo}</dd>
          </div>
        ) : null}
        {mismatch.description ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Description</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{mismatch.description}</dd>
          </div>
        ) : null}
        {mismatch.resolutionNotes ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Resolution notes</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{mismatch.resolutionNotes}</dd>
          </div>
        ) : null}
      </dl>

      {canOperate ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onAssign}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50"
          >
            Assign for review
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onResolve}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Resolve mismatch
          </button>
        </div>
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This mismatch is in a terminal or non-actionable state according to the backend.
        </p>
      )}
    </section>
  );
}
