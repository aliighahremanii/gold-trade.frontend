import Link from "next/link";

import type { WithdrawalStatusView } from "@/modules/payments/mappers/map-withdrawal-detail";
import {
  isCancellableWithdrawalStatus,
  isCancelledWithdrawalStatus,
  isFailedWithdrawalStatus,
  isManualReviewWithdrawalStatus,
  isPendingWithdrawalStatus,
  isRejectedWithdrawalStatus,
  isSuccessfulWithdrawalStatus,
} from "@/modules/payments/utils/payment-status";

type WithdrawalStatusPanelProps = {
  withdrawal: WithdrawalStatusView;
  isPolling: boolean;
  isCancelling: boolean;
  onCancel?: () => void;
  showDetailLink?: boolean;
};

export function WithdrawalStatusPanel({
  withdrawal,
  isPolling,
  isCancelling,
  onCancel,
  showDetailLink = false,
}: WithdrawalStatusPanelProps) {
  const isSuccess = isSuccessfulWithdrawalStatus(withdrawal.status);
  const isFailed = isFailedWithdrawalStatus(withdrawal.status);
  const isRejected = isRejectedWithdrawalStatus(withdrawal.status);
  const isCancelled = isCancelledWithdrawalStatus(withdrawal.status);
  const isTerminalFailure = isFailed || isRejected;
  const isPending = isPendingWithdrawalStatus(withdrawal.status);
  const isManualReview = isManualReviewWithdrawalStatus(withdrawal.status);
  const canCancel = Boolean(onCancel) && isCancellableWithdrawalStatus(withdrawal.status);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Withdrawal status</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{withdrawal.bankAccountReference}</p>
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
          {withdrawal.statusLabel}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Withdrawal ID</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.withdrawalId}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{withdrawal.amountLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.status}</dd>
        </div>
        {withdrawal.walletLockId ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Wallet lock</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.walletLockId}</dd>
          </div>
        ) : null}
        {withdrawal.bankTransferReference ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Bank transfer reference</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.bankTransferReference}</dd>
          </div>
        ) : null}
        {withdrawal.settlementId ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Settlement ID</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{withdrawal.settlementId}</dd>
          </div>
        ) : null}
        {withdrawal.failureReason ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-red-700 dark:text-red-300">{withdrawal.failureReason}</dd>
          </div>
        ) : null}
      </dl>

      {isPolling ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Waiting for backend withdrawal updates...
        </p>
      ) : null}

      {isPending ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Withdrawal is not final until the backend completes payout and settlement.
        </p>
      ) : null}

      {isManualReview ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Manual review is required before this withdrawal can be paid out.
        </p>
      ) : null}

      {isSuccess ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
          Backend marked the withdrawal completed. Wallet balances were refreshed from the server.
        </p>
      ) : null}

      {isCancelled ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This withdrawal was cancelled. Locked IRR is released only after the backend confirms
          cancellation.
        </p>
      ) : null}

      {isRejected ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This withdrawal was rejected during review. Check the failure reason and submit a new request
          when ready.
        </p>
      ) : null}

      {isFailed && !isRejected ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This withdrawal failed on the backend. You can submit a new withdrawal when ready.
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
            {isCancelling ? "Cancelling..." : "Cancel withdrawal"}
          </button>
        ) : null}
        {showDetailLink ? (
          <Link
            href={`/payments/withdraw/${withdrawal.withdrawalId}`}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            View details
          </Link>
        ) : null}
      </div>
    </section>
  );
}
