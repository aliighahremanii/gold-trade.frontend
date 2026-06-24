import type { ReconciliationRunView } from "@/modules/reconciliation/mappers/map-reconciliation-views";

type ReconciliationRunTableProps = {
  runs: ReconciliationRunView[];
  selectedRunId?: string | null;
  isLoading?: boolean;
  onSelectRun: (runId: string) => void;
};

export function ReconciliationRunTable({
  runs,
  selectedRunId,
  isLoading = false,
  onSelectRun,
}: ReconciliationRunTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading reconciliation runs...
      </p>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No reconciliation runs are available yet. Start a comparison run or wait for backend
        reconciliation jobs.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Run</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Type</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">
              Mismatches
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Started</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {runs.map((run) => {
            const isSelected = selectedRunId === run.id;

            return (
              <tr key={run.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">{run.id}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{run.runTypeLabel}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{run.statusLabel}</td>
                <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">
                  {run.mismatchCount ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {run.startedAtLabel ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectRun(run.id)}
                    className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
                  >
                    {isSelected ? "Selected" : "Open"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
