import type { ReconciliationMismatchView } from "@/modules/reconciliation/mappers/map-reconciliation-views";

type ReconciliationMismatchTableProps = {
  mismatches: ReconciliationMismatchView[];
  selectedMismatchId?: string | null;
  isLoading?: boolean;
  onSelectMismatch: (mismatchId: string) => void;
};

export function ReconciliationMismatchTable({
  mismatches,
  selectedMismatchId,
  isLoading = false,
  onSelectMismatch,
}: ReconciliationMismatchTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading reconciliation mismatches...
      </p>
    );
  }

  if (mismatches.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No reconciliation mismatches match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">
              Mismatch
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Type</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Expected</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actual</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {mismatches.map((mismatch) => {
            const isSelected = selectedMismatchId === mismatch.id;

            return (
              <tr key={mismatch.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">
                  {mismatch.id}
                </td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{mismatch.mismatchType}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{mismatch.statusLabel}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {mismatch.expectedValue ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {mismatch.actualValue ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectMismatch(mismatch.id)}
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
