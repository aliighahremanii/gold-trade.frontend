"use client";

import Link from "next/link";

import { PaymentErrorAlert } from "@/modules/payments/components/payment-error-alert";
import { WithdrawalStatusPanel } from "@/modules/payments/components/withdrawal-status-panel";
import { useWithdrawIrrDetailWorkflow } from "@/modules/payments/hooks/use-withdraw-irr-workflow";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

type WithdrawIrrDetailFlowProps = {
  withdrawalId: string;
};

export function WithdrawIrrDetailFlow({ withdrawalId }: WithdrawIrrDetailFlowProps) {
  const workflow = useWithdrawIrrDetailWorkflow(withdrawalId);

  return (
    <CustomerWorkflowShell
      title="Withdrawal detail"
      module="payments"
      description="Backend-owned withdrawal status, wallet lock, payout references, and settlement visibility."
    >
      <div className="flex flex-col gap-6">
        <Link
          href="/payments/withdraw"
          className="self-start text-sm font-medium text-zinc-700 underline dark:text-zinc-300"
        >
          Back to withdrawals
        </Link>

        <PaymentErrorAlert error={workflow.actionError} />

        {workflow.isLoading ? (
          <p className="text-sm text-zinc-500" aria-live="polite">
            Loading withdrawal status...
          </p>
        ) : null}

        {workflow.isError ? (
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            Withdrawal details could not be loaded.
          </p>
        ) : null}

        {workflow.withdrawalView ? (
          <WithdrawalStatusPanel
            withdrawal={workflow.withdrawalView}
            isPolling={workflow.isPolling}
            isCancelling={workflow.isCancelling}
            onCancel={() => {
              void workflow.cancelWithdrawal();
            }}
          />
        ) : null}
      </div>
    </CustomerWorkflowShell>
  );
}
