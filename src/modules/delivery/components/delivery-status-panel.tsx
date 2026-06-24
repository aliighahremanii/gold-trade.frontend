import Link from "next/link";

import type { DeliveryRequestStatusView } from "@/modules/delivery/mappers/map-delivery-request";
import {
  isCancellableDeliveryStatus,
  isCancelledDeliveryStatus,
  isFailedDeliveryStatus,
  isManualReviewDeliveryStatus,
  isPendingDeliveryStatus,
  isRejectedDeliveryStatus,
  isSuccessfulDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";

type DeliveryStatusPanelProps = {
  request: DeliveryRequestStatusView;
  zoneLabel?: string | null;
  isPolling: boolean;
  isCancelling: boolean;
  onCancel?: () => void;
  showDetailLink?: boolean;
};

export function DeliveryStatusPanel({
  request,
  zoneLabel,
  isPolling,
  isCancelling,
  onCancel,
  showDetailLink = false,
}: DeliveryStatusPanelProps) {
  const isSuccess = isSuccessfulDeliveryStatus(request.status);
  const isFailed = isFailedDeliveryStatus(request.status);
  const isRejected = isRejectedDeliveryStatus(request.status);
  const isCancelled = isCancelledDeliveryStatus(request.status);
  const isTerminalFailure = isFailed || isRejected;
  const isPending = isPendingDeliveryStatus(request.status);
  const isManualReview = isManualReviewDeliveryStatus(request.status);
  const canCancel = Boolean(onCancel) && isCancellableDeliveryStatus(request.status);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Delivery status</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {request.recipientName} · {request.recipientPhone}
          </p>
        </div>
        <span
          className={
            isSuccess
              ? "rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
              : isTerminalFailure || isCancelled
                ? "rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
                : isManualReview
                  ? "rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
                  : "rounded-full border border-zinc-300 bg-zinc-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          }
        >
          {request.statusLabel}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Request ID</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.requestId}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{request.amountLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.status}</dd>
        </div>
        {zoneLabel ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Delivery zone</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{zoneLabel}</dd>
          </div>
        ) : null}
        {request.walletLockId ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Wallet lock</dt>
            <dd className="font-mono text-amber-800 dark:text-amber-200">{request.walletLockId}</dd>
          </div>
        ) : null}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-zinc-500">Delivery address</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{request.deliveryAddress}</dd>
        </div>
        {request.scheduledAt ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Scheduled at</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.scheduledAt}</dd>
          </div>
        ) : null}
        {request.completedAt ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Completed at</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.completedAt}</dd>
          </div>
        ) : null}
        {request.handoverReference ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Handover reference</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.handoverReference}</dd>
          </div>
        ) : null}
        {request.settlementId ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Settlement ID</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.settlementId}</dd>
          </div>
        ) : null}
        {request.failureReason ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-red-700 dark:text-red-300">{request.failureReason}</dd>
          </div>
        ) : null}
      </dl>

      {isPolling ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Waiting for backend delivery updates...
        </p>
      ) : null}

      {isPending ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Delivery is not final until the backend completes handover and settlement.
        </p>
      ) : null}

      {isManualReview ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Manual review is required before this delivery can be scheduled.
        </p>
      ) : null}

      {request.walletLockId && isPending ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Gold is locked in your wallet for this delivery request.
        </p>
      ) : null}

      {isSuccess ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
          Backend marked the delivery completed. Wallet balances were refreshed from the server.
        </p>
      ) : null}

      {isCancelled ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This delivery request was cancelled. Locked gold is released only after the backend confirms
          cancellation.
        </p>
      ) : null}

      {isRejected ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This delivery request was rejected during review. Check the failure reason and submit a new
          request when ready.
        </p>
      ) : null}

      {isFailed ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This delivery failed on the backend. Wallet balances remain backend-owned until the request
          reaches a terminal state.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {canCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelling}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            {isCancelling ? "Cancelling..." : "Cancel delivery"}
          </button>
        ) : null}
        {showDetailLink ? (
          <Link
            href={`/delivery/${request.requestId}`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            View details
          </Link>
        ) : null}
      </div>
    </section>
  );
}
