import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminLedgerTransactionView } from "@/modules/ledger/mappers/map-ledger-transaction";

type AdminLedgerTransactionTableProps = {
  transactions: AdminLedgerTransactionView[];
  selectedTransactionId?: string | null;
  isLoading?: boolean;
  onSelectTransaction: (transactionId: string) => void;
};

export function AdminLedgerTransactionTable({
  transactions,
  selectedTransactionId,
  isLoading = false,
  onSelectTransaction,
}: AdminLedgerTransactionTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading ledger transactions...
      </p>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No ledger transactions are loaded yet. Enter a posting ID to inspect backend-reported
        entries.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">
              Transaction
            </th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Type</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Source</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Posted</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {transactions.map((transaction) => {
            const isSelected = selectedTransactionId === transaction.id;

            return (
              <tr
                key={transaction.id}
                className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">
                  {transaction.id}
                </td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                  {transaction.transactionType}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {transaction.sourceModule} / {transaction.sourceOperationType}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatTimestamp(transaction.postedAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectTransaction(transaction.id)}
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
