import type { DepositStatusView } from "@/modules/payments/mappers/map-deposit-detail";
import {
  isFailedDepositStatus,
  isPendingDepositStatus,
  isSuccessfulDepositStatus,
} from "@/modules/payments/utils/payment-status";

type DepositStatusPanelProps = {
  deposit: DepositStatusView;
  isPolling: boolean;
  onStartOver: () => void;
};

export function DepositStatusPanel({ deposit, isPolling, onStartOver }: DepositStatusPanelProps) {
  const isSuccess = isSuccessfulDepositStatus(deposit.status);
  const isFailed = isFailedDepositStatus(deposit.status);
  const isPending = isPendingDepositStatus(deposit.status);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Deposit status</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{deposit.gatewayProvider}</p>
        </div>
        <span
          className={
            isSuccess
              ? "rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
              : isFailed
                ? "rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
                : "rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
          }
        >
          {deposit.statusLabel}
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Deposit ID</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.depositId}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Amount</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{deposit.amountLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Backend status</dt>
          <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.status}</dd>
        </div>
        {deposit.gatewayReference ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Gateway reference</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.gatewayReference}</dd>
          </div>
        ) : null}
        {deposit.gatewayTrackingCode ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Tracking code</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.gatewayTrackingCode}</dd>
          </div>
        ) : null}
        {deposit.bankReference ? (
          <div className="flex flex-col gap-1">
            <dt className="text-zinc-500">Bank reference</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.bankReference}</dd>
          </div>
        ) : null}
        {deposit.settlementId ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Settlement ID</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-50">{deposit.settlementId}</dd>
          </div>
        ) : null}
        {deposit.failureReason ? (
          <div className="flex flex-col gap-1 sm:col-span-2">
            <dt className="text-zinc-500">Failure reason</dt>
            <dd className="text-red-700 dark:text-red-300">{deposit.failureReason}</dd>
          </div>
        ) : null}
      </dl>

      {isPending && deposit.paymentUrl ? (
        <a
          href={deposit.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Continue to payment gateway
        </a>
      ) : null}

      {isPolling ? (
        <p className="text-sm text-zinc-500" aria-live="polite">
          Waiting for backend payment confirmation...
        </p>
      ) : null}

      {isPending ? (
        <p className="text-sm text-amber-800 dark:text-amber-200" role="status">
          Deposit is not final until the backend confirms payment and settlement.
        </p>
      ) : null}

      {isSuccess ? (
        <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
          Backend confirmed the deposit. Wallet balances were refreshed from the server.
        </p>
      ) : null}

      {isFailed ? (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          This deposit failed on the backend. You can start a new deposit when ready.
        </p>
      ) : null}

      {(isSuccess || isFailed) && (
        <button
          type="button"
          onClick={onStartOver}
          className="self-start rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Start another deposit
        </button>
      )}
    </section>
  );
}
