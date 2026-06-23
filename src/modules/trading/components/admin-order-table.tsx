import Link from "next/link";

import type { AdminOrderView } from "@/modules/trading/mappers/map-order-detail";
import { OrderStatusBadge } from "@/modules/trading/components/order-status-badge";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

type AdminOrderTableProps = {
  orders: AdminOrderView[];
  selectedOrderId?: string | null;
  isLoading?: boolean;
  onSelectOrder: (orderId: string) => void;
};

export function AdminOrderTable({
  orders,
  selectedOrderId,
  isLoading = false,
  onSelectOrder,
}: AdminOrderTableProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Loading orders...
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No orders are loaded yet. Add an order ID or open items from the manual review queue on
        Approvals.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Order</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Status</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Side</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Total</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Updated</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-600 dark:text-zinc-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
          {orders.map((order) => {
            const isSelected = selectedOrderId === order.id;

            return (
              <tr key={order.id} className={isSelected ? "bg-zinc-50 dark:bg-zinc-900" : undefined}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-900 dark:text-zinc-50">{order.id}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{order.side}</td>
                <td className="px-4 py-3 font-mono text-zinc-900 dark:text-zinc-50">{order.totalQuoteLabel}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {formatTimestamp(order.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectOrder(order.id)}
                      className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
                    >
                      {isSelected ? "Selected" : "Open"}
                    </button>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
                    >
                      Page
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
