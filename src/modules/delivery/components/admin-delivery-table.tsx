import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminDeliveryRequestView } from "@/modules/delivery/mappers/map-delivery-request-admin-view";

type AdminDeliveryTableProps = {
  requests: AdminDeliveryRequestView[];
  selectedRequestId?: string | null;
  isLoading?: boolean;
  onSelectRequest: (requestId: string) => void;
};

export function AdminDeliveryTable({
  requests,
  selectedRequestId,
  isLoading = false,
  onSelectRequest,
}: AdminDeliveryTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading delivery requests...
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No delivery requests are loaded yet. Add a request ID or load items referenced by the manual
        review queue.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Request</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">User</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Recipient</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Updated</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {requests.map((request) => {
            const isSelected = selectedRequestId === request.id;

            return (
              <tr key={request.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">{request.id}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{request.statusLabel}</td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {request.userId}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">{request.amountLabel}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{request.recipientName}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatTimestamp(request.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelectRequest(request.id)}
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
