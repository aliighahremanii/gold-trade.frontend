import {
  getOrderWorkflowLabel,
  isManualReviewOrderStatus,
  isSettlementFailedOrderStatus,
  isSettlementPendingOrderStatus,
  isSuccessfulOrderStatus,
} from "@/modules/trading/utils/order-status";

type OrderStatusBadgeProps = {
  status: string;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const label = getOrderWorkflowLabel(status);
  const className = getBadgeClassName(status);

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

function getBadgeClassName(status: string): string {
  if (isSuccessfulOrderStatus(status)) {
    return "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100";
  }

  if (isManualReviewOrderStatus(status)) {
    return "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100";
  }

  if (isSettlementFailedOrderStatus(status) || status.toLowerCase() === "failed") {
    return "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100";
  }

  if (isSettlementPendingOrderStatus(status) || status.toLowerCase().includes("pending")) {
    return "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100";
  }

  return "border-zinc-300 bg-zinc-50 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
}
