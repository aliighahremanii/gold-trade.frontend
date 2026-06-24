import Link from "next/link";

import { formatTimestamp } from "@/shared/utils/format-timestamp";

import type { AdminDepositView } from "@/modules/payments/mappers/map-deposit-admin-view";
import { isConfirmableDepositStatus } from "@/modules/payments/utils/payment-status";

type AdminDepositDetailPanelProps = {
  deposit: AdminDepositView;
  isSubmitting: boolean;
  onConfirm: () => void;
};

export function AdminDepositDetailPanel({
  deposit,
  isSubmitting,
  onConfirm,
}: AdminDepositDetailPanelProps) {
  const canConfirm = isConfirmableDepositStatus(deposit.status);

  return (
    <section
      aria-label="Deposit detail"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Deposit detail</h2>
          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{deposit.id}</p>
        </div>
        <span className="text-sm text-zinc-700 dark:text-zinc-300">{deposit.statusLabel}</span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">User</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{deposit.userId}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.amountLabel}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Gateway</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{deposit.gatewayProvider}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.status}</dd>
        </div>
        {deposit.gatewayReference ? (
          <div>
            <dt className="text-zinc-500">Gateway reference</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{deposit.gatewayReference}</dd>
          </div>
        ) : null}
        {deposit.bankReference ? (
          <div>
            <dt className="text-zinc-500">Bank reference</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{deposit.bankReference}</dd>
          </div>
        ) : null}
        {deposit.settlementId ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Settlement ID</dt>
            <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{deposit.settlementId}</dd>
          </div>
        ) : null}
        {deposit.failureReason ? (
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-amber-800 dark:text-amber-200">{deposit.failureReason}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-zinc-500">Updated</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{formatTimestamp(deposit.updatedAt)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        {canConfirm ? (
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isSubmitting ? "Submitting..." : "Confirm deposit"}
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
