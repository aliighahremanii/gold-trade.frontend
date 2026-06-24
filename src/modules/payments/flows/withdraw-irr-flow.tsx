"use client";

import { PaymentErrorAlert } from "@/modules/payments/components/payment-error-alert";
import { WithdrawalConfirmationModal } from "@/modules/payments/components/withdrawal-confirmation-modal";
import { WithdrawalRequestForm } from "@/modules/payments/components/withdrawal-request-form";
import { WithdrawalSessionList } from "@/modules/payments/components/withdrawal-session-list";
import { WithdrawalStatusPanel } from "@/modules/payments/components/withdrawal-status-panel";
import { useWithdrawIrrWorkflow } from "@/modules/payments/hooks/use-withdraw-irr-workflow";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function WithdrawIrrFlow() {
  const workflow = useWithdrawIrrWorkflow();

  return (
    <CustomerWorkflowShell
      title="Withdraw IRR"
      module="payments"
      description="Request IRR withdrawals, track payout and approval states, and refresh wallet balances only after backend confirmation."
    >
      <div className="flex flex-col gap-6">
        <PaymentErrorAlert error={workflow.actionError} />

        <WithdrawalRequestForm
          amount={workflow.amountInput}
          bankAccountReference={workflow.bankAccountReference}
          fieldErrors={workflow.fieldErrors}
          isSubmitting={workflow.isSubmitting}
          onAmountChange={workflow.setAmountInput}
          onBankAccountReferenceChange={workflow.setBankAccountReference}
          onSubmit={workflow.openConfirmationModal}
        />

        {workflow.latestWithdrawalView ? (
          <WithdrawalStatusPanel
            withdrawal={workflow.latestWithdrawalView}
            isPolling={workflow.isPolling}
            isCancelling={workflow.isCancelling}
            onCancel={() => {
              void workflow.cancelLatestWithdrawal();
            }}
            showDetailLink
          />
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent withdrawals</h2>
          <WithdrawalSessionList withdrawalIds={workflow.sessionWithdrawalIds} />
        </section>
      </div>

      <WithdrawalConfirmationModal
        isOpen={workflow.isConfirmModalOpen && workflow.pendingWithdrawalAmount !== null}
        amount={workflow.pendingWithdrawalAmount ?? 0}
        bankAccountReference={workflow.bankAccountReference.trim()}
        isSubmitting={workflow.isSubmitting}
        onCancel={workflow.closeConfirmationModal}
        onConfirm={() => {
          void workflow.submitWithdrawal();
        }}
      />
    </CustomerWorkflowShell>
  );
}
