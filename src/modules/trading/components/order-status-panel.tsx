import type { OrderDetail } from "@/modules/trading/api/use-orders";
import { formatTradeAmount } from "@/modules/trading/utils/format-trade-amount";
import {
  getOrderWorkflowLabel,
  isManualReviewOrderStatus,
  isSettlementFailedOrderStatus,
  isSettlementPendingOrderStatus,
  isSuccessfulOrderStatus,
} from "@/modules/trading/utils/order-status";

type OrderStatusPanelProps = {
  order: OrderDetail;
  isPolling: boolean;
};

export function OrderStatusPanel({ order, isPolling }: OrderStatusPanelProps) {
  const workflowLabel = getOrderWorkflowLabel(order.status);
  const isSuccess = isSuccessfulOrderStatus(order.status);
  const isSettlementPending = isSettlementPendingOrderStatus(order.status);
  const isSettlementFailed = isSettlementFailedOrderStatus(order.status);
  const isManualReview = isManualReviewOrderStatus(order.status);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Order status</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {order.market_symbol} · {order.side}
          </p>
        </div>
        <span
          className={
            isSuccess
              ? "rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
              : isSettlementFailed
                ? "rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
                : isManualReview
                  ? "rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
                  : "rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          }
        >
          {workflowLabel}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Order ID</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{order.id}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{order.status}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Gold amount</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">
            {formatTradeAmount(order.base_asset_code, order.base_amount)}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Total IRR</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">
            {formatTradeAmount(order.quote_asset_code, order.total_quote_amount)}
          </dd>
        </div>
        {order.wallet_lock_id ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Wallet lock</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{order.wallet_lock_id}</dd>
          </div>
        ) : null}
        {order.failure_reason ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-red-700 dark:text-red-300">{order.failure_reason}</dd>
          </div>
        ) : null}
        {order.approval_reason ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Review reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{order.approval_reason}</dd>
          </div>
        ) : null}
      </dl>

      {isPolling ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Waiting for backend order and settlement updates...
        </p>
      ) : null}

      {isSettlementPending ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
          Settlement is still in progress. Balances update only after the backend completes settlement.
        </p>
      ) : null}

      {isSettlementFailed ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          Settlement failed. Wallet balances remain backend-owned until support or retry resolves the
          order.
        </p>
      ) : null}

      {isManualReview ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Manual review is required before this order can continue.
        </p>
      ) : null}
    </section>
  );
}
