import Link from "next/link";

import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminDeliveryRequestView } from "@/modules/delivery/mappers/map-delivery-request-admin-view";
import {
  isApprovableDeliveryStatus,
  isCompletableDeliveryStatus,
  isRejectableDeliveryStatus,
  isSchedulableDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";

type AdminDeliveryDetailPanelProps = {
  request: AdminDeliveryRequestView;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onSchedule: () => void;
  onComplete: () => void;
};

export function AdminDeliveryDetailPanel({
  request,
  isSubmitting,
  onApprove,
  onReject,
  onSchedule,
  onComplete,
}: AdminDeliveryDetailPanelProps) {
  const canApprove = isApprovableDeliveryStatus(request.status);
  const canReject = isRejectableDeliveryStatus(request.status);
  const canSchedule = isSchedulableDeliveryStatus(request.status);
  const canComplete = isCompletableDeliveryStatus(request.status);

  return (
    <section
      aria-label="Delivery request detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Delivery request</h2>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{request.id}</p>
        </div>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{request.statusLabel}</span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">User</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{request.userId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">
            {request.amountLabel} {request.assetCode}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Recipient</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{request.recipientName}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Phone</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{request.recipientPhone}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Delivery address</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{request.deliveryAddress}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Zone</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{request.deliveryZoneId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{request.status}</dd>
        </div>
        {request.scheduledAt ? (
          <div>
            <dt className="text-zinc-500">Scheduled at</dt>
            <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(request.scheduledAt)}</dd>
          </div>
        ) : null}
        {request.handoverReference ? (
          <div>
            <dt className="text-zinc-500">Handover reference</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{request.handoverReference}</dd>
          </div>
        ) : null}
        {request.walletLockId ? (
          <div>
            <dt className="text-zinc-500">Wallet lock</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{request.walletLockId}</dd>
          </div>
        ) : null}
        {request.failureReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{request.failureReason}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-zinc-500">Updated</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(request.updatedAt)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        {canApprove ? (
          <button
            type="button"
            onClick={onApprove}
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Approve request
          </button>
        ) : null}
        {canSchedule ? (
          <button
            type="button"
            onClick={onSchedule}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50"
          >
            Schedule delivery
          </button>
        ) : null}
        {canComplete ? (
          <button
            type="button"
            onClick={onComplete}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50"
          >
            Complete handover
          </button>
        ) : null}
        {canReject ? (
          <button
            type="button"
            onClick={onReject}
            disabled={isSubmitting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-100"
          >
            Reject request
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
