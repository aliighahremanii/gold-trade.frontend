import Link from "next/link";

import { useExecution } from "@/modules/liquidity/api/use-executions";
import type { AdminOrderView } from "@/modules/trading/mappers/map-order-detail";
import { OrderStatusBadge } from "@/modules/trading/components/order-status-badge";
import { ProviderExecutionPanel } from "@/modules/trading/components/provider-execution-panel";
import { isManualReviewOrderStatus } from "@/modules/trading/utils/order-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

type AdminOrderDetailPanelProps = {
  order: AdminOrderView;
  isApproving: boolean;
  onApprove: () => void;
};

export function AdminOrderDetailPanel({ order, isApproving, onApprove }: AdminOrderDetailPanelProps) {
  const executionQuery = useExecution(order.executionId, Boolean(order.executionId));
  const canApprove = isManualReviewOrderStatus(order.status);

  return (
    <section
      aria-label="Order detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Order detail</h2>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{order.id}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Market</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{order.marketSymbol}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Side</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{order.side}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Quantity</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{order.quantityLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Total quote</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{order.totalQuoteLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">User</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{order.userId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Updated</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(order.updatedAt)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Quote</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{order.quoteId}</dd>
        </div>
        {order.failureReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{order.failureReason}</dd>
          </div>
        ) : null}
        {order.approvalReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Approval reason</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{order.approvalReason}</dd>
          </div>
        ) : null}
        {order.approvedBy ? (
          <div>
            <dt className="text-zinc-500">Approved by</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{order.approvedBy}</dd>
          </div>
        ) : null}
        {order.approvedAt ? (
          <div>
            <dt className="text-zinc-500">Approved at</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(order.approvedAt)}</dd>
          </div>
        ) : null}
      </dl>

      {order.executionId ? (
        executionQuery.isLoading ? (
          <p className="text-sm text-zinc-500">Loading provider execution...</p>
        ) : executionQuery.isError ? (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            Provider execution details could not be loaded.
          </p>
        ) : executionQuery.data ? (
          <ProviderExecutionPanel execution={executionQuery.data} />
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            No provider execution details are available yet.
          </p>
        )
      ) : (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Provider execution has not been assigned by the backend yet.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {canApprove ? (
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isApproving ? "Submitting..." : "Review approval"}
          </button>
        ) : null}
        <Link href="/admin/approvals" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Open manual review queue
        </Link>
        <Link href="/admin/audit" className="text-sm font-medium text-zinc-900 underline dark:text-zinc-50">
          Audit trail
        </Link>
      </div>
    </section>
  );
}
