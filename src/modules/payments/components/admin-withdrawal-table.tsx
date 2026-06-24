import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminWithdrawalView } from "@/modules/payments/mappers/map-withdrawal-admin-view";

type AdminWithdrawalTableProps = {
  withdrawals: AdminWithdrawalView[];
  selectedWithdrawalId?: string | null;
  isLoading?: boolean;
  onSelectWithdrawal: (withdrawalId: string) => void;
};

export function AdminWithdrawalTable({
  withdrawals,
  selectedWithdrawalId,
  isLoading = false,
  onSelectWithdrawal,
}: AdminWithdrawalTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading withdrawals...
      </p>
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No withdrawals are loaded yet. Add a withdrawal ID or load items referenced by the manual
        review queue.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">
              Withdrawal
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">User</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Bank account</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Updated</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {withdrawals.map((withdrawal) => {
            const isSelected = selectedWithdrawalId === withdrawal.id;

            return (
              <tr key={withdrawal.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">{withdrawal.id}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{withdrawal.statusLabel}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {withdrawal.userId}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">
                  {withdrawal.amountLabel}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {withdrawal.bankAccountReference}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatTimestamp(withdrawal.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectWithdrawal(withdrawal.id)}
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
