import Link from "next/link";

type WithdrawalSessionListProps = {
  withdrawalIds: string[];
};

export function WithdrawalSessionList({ withdrawalIds }: WithdrawalSessionListProps) {
  if (withdrawalIds.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        Withdrawals requested in this browser session will appear here. There is no list endpoint in the
        current payments contract, so history is limited to this session.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-start text-sm">
        <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Withdrawal ID
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950">
          {withdrawalIds.map((withdrawalId) => (
            <tr key={withdrawalId} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">{withdrawalId}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/payments/withdraw/${withdrawalId}`}
                  className="font-medium text-zinc-900 underline dark:text-zinc-50"
                >
                  View status
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
