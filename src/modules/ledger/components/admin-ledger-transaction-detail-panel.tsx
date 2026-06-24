import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminLedgerTransactionView } from "@/modules/ledger/mappers/map-ledger-transaction";

type AdminLedgerTransactionDetailPanelProps = {
  transaction: AdminLedgerTransactionView;
};

export function AdminLedgerTransactionDetailPanel({
  transaction,
}: AdminLedgerTransactionDetailPanelProps) {
  return (
    <section
      aria-label="Ledger transaction detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Ledger transaction</h2>
        <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{transaction.id}</p>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Type</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{transaction.transactionType}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Posted at</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(transaction.postedAt)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Description</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{transaction.description}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Source module</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {transaction.sourceModule}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Source operation</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {transaction.sourceOperationType}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Source operation ID</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {transaction.sourceOperationId}
          </dd>
        </div>
        {transaction.marketSymbol ? (
          <div>
            <dt className="text-zinc-500">Market</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{transaction.marketSymbol}</dd>
          </div>
        ) : null}
        {transaction.reversesTransactionId ? (
          <div>
            <dt className="text-zinc-500">Reverses transaction</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {transaction.reversesTransactionId}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Entries</h3>
        {transaction.entries.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No entries were returned.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                    Account
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                    Direction
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-zinc-600 dark:text-zinc-300">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                {transaction.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-3 py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                      {entry.accountId}
                    </td>
                    <td className="px-3 py-2 text-zinc-900 dark:text-zinc-50">{entry.direction}</td>
                    <td className="px-3 py-2 font-mono text-zinc-900 dark:text-zinc-50">
                      {entry.amountLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
