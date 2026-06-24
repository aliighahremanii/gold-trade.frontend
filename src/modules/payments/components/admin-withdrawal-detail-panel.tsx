import Link from "next/link";

import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminWithdrawalView } from "@/modules/payments/mappers/map-withdrawal-admin-view";
import {
  isApprovableWithdrawalStatus,
  isCompletableWithdrawalStatus,
  isRejectableWithdrawalStatus,
} from "@/modules/payments/utils/payment-status";

type AdminWithdrawalDetailPanelProps = {
  withdrawal: AdminWithdrawalView;
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
  onComplete: () => void;
};

export function AdminWithdrawalDetailPanel({
  withdrawal,
  isSubmitting,
  onApprove,
  onReject,
  onComplete,
}: AdminWithdrawalDetailPanelProps) {
  const canApprove = isApprovableWithdrawalStatus(withdrawal.status);
  const canReject = isRejectableWithdrawalStatus(withdrawal.status);
  const canComplete = isCompletableWithdrawalStatus(withdrawal.status);

  return (
    <section
      aria-label="Withdrawal detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Withdrawal detail</h2>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{withdrawal.id}</p>
        </div>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{withdrawal.statusLabel}</span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">User</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{withdrawal.userId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.amountLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Bank account</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {withdrawal.bankAccountReference}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.status}</dd>
        </div>
        {withdrawal.bankTransferReference ? (
          <div>
            <dt className="text-zinc-500">Bank transfer reference</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {withdrawal.bankTransferReference}
            </dd>
          </div>
        ) : null}
        {withdrawal.walletLockId ? (
          <div>
            <dt className="text-zinc-500">Wallet lock</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{withdrawal.walletLockId}</dd>
          </div>
        ) : null}
        {withdrawal.approvedBy ? (
          <div>
            <dt className="text-zinc-500">Approved by</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{withdrawal.approvedBy}</dd>
          </div>
        ) : null}
        {withdrawal.failureReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{withdrawal.failureReason}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-zinc-500">Updated</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(withdrawal.updatedAt)}</dd>
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
            Approve withdrawal
          </button>
        ) : null}
        {canComplete ? (
          <button
            type="button"
            onClick={onComplete}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50"
          >
            Complete payout
          </button>
        ) : null}
        {canReject ? (
          <button
            type="button"
            onClick={onReject}
            disabled={isSubmitting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:text-red-100"
          >
            Reject withdrawal
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
