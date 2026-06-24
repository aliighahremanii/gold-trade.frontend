import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminAuditRecordView } from "@/modules/audit/mappers/parse-audit-record-response";

type AdminAuditTableProps = {
  records: AdminAuditRecordView[];
  selectedRecordId?: string | null;
  isLoading?: boolean;
  onSelectRecord: (recordId: string) => void;
};

export function AdminAuditTable({
  records,
  selectedRecordId,
  isLoading = false,
  onSelectRecord,
}: AdminAuditTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading audit records...
      </p>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No audit records match the current filters. Adjust filters or confirm backend audit data is
        available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Record</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Action</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actor</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Target</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Created</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {records.map((record) => {
            const isSelected = selectedRecordId === record.id;

            return (
              <tr key={record.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">
                  {record.id}
                </td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{record.action ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {record.actorId ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {record.targetType ? `${record.targetType}: ${record.targetId ?? "—"}` : "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {record.createdAt ? formatTimestamp(record.createdAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectRecord(record.id)}
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
