"use client";

import { DepositAmountForm } from "@/modules/payments/components/deposit-amount-form";
import { DepositStatusPanel } from "@/modules/payments/components/deposit-status-panel";
import { PaymentErrorAlert } from "@/modules/payments/components/payment-error-alert";
import { useDepositIrrWorkflow } from "@/modules/payments/hooks/use-deposit-irr-workflow";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

type DepositIrrFlowProps = {
  initialDepositId?: string | null;
};

export function DepositIrrFlow({ initialDepositId = null }: DepositIrrFlowProps) {
  const workflow = useDepositIrrWorkflow({ initialDepositId });

  return (
    <CustomerWorkflowShell
      title="Deposit IRR"
      module="payments"
      description="Create a backend deposit intent, complete gateway payment when required, and track pending or confirmed states from payment APIs."
    >
      <div className="flex flex-col gap-6">
        <PaymentErrorAlert error={workflow.actionError} />

        {workflow.displayPhase === "idle" || workflow.displayPhase === "creating" ? (
          <DepositAmountForm
            amount={workflow.amountInput}
            isSubmitting={workflow.isSubmitting}
            onAmountChange={workflow.setAmountInput}
            onSubmit={() => {
              void workflow.startDeposit();
            }}
          />
        ) : null}

        {workflow.depositView &&
        (workflow.displayPhase === "tracking" ||
          workflow.displayPhase === "completed" ||
          workflow.displayPhase === "failed") ? (
          <DepositStatusPanel
            deposit={workflow.depositView}
            isPolling={workflow.isPolling}
            onStartOver={workflow.resetWorkflow}
          />
        ) : null}
      </div>
    </CustomerWorkflowShell>
  );
}
