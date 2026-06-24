"use client";

import { useMemo } from "react";

import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { AdminDepositDetailPanel } from "@/modules/payments/components/admin-deposit-detail-panel";
import { AdminDepositTable } from "@/modules/payments/components/admin-deposit-table";
import { AdminWithdrawalDetailPanel } from "@/modules/payments/components/admin-withdrawal-detail-panel";
import { AdminWithdrawalTable } from "@/modules/payments/components/admin-withdrawal-table";
import { useAdminPaymentsWorkflow } from "@/modules/payments/hooks/use-admin-payments-workflow";
import { ApiErrorAlert } from "@/shared/errors";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { AdminRecordFilters } from "@/shared/ui/admin-record-filters";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

export function AdminPaymentsFlow() {
  const workflow = useAdminPaymentsWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = [...workflow.deposits, ...workflow.withdrawals]
      .map((record) => record.updatedAt)
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.deposits, workflow.withdrawals]);

  return (
    <AdminWorkflowShell
      title="Payments"
      module="payments"
      description="Review IRR deposits and withdrawals referenced by the manual review queue or loaded by ID. Confirm deposits and manage payout actions through backend admin APIs."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Payments data status"
          loadingMessage="Loading payments..."
          refreshingMessage="Refreshing payments..."
          errorFallbackMessage="Payments data could not be loaded."
          isLoading={workflow.isLoadingDeposits || workflow.isLoadingWithdrawals}
          isFetching={workflow.reviewCasesQuery.isFetching}
          isError={workflow.reviewCasesQuery.isError}
          errorMessage={
            workflow.reviewCasesQuery.error instanceof Error
              ? workflow.reviewCasesQuery.error.message
              : undefined
          }
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={workflow.refresh}
        />

        {workflow.submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Payment action submitted. Refresh records to confirm backend-reported status.
          </p>
        ) : null}

        <ApiErrorAlert error={workflow.actionError} />

        <AdminRecordFilters
          filters={workflow.filters}
          onChange={workflow.setFilters}
          onReset={workflow.resetFilters}
        />

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Deposits</h2>
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              workflow.addDepositToWatchList(workflow.lookupDepositId);
            }}
          >
            <div className="min-w-[16rem] flex-1">
              <AuthFormField
                id="admin-deposit-lookup"
                label="Load deposit by ID"
                value={workflow.lookupDepositId}
                onChange={(event) => workflow.setLookupDepositId(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Add to table
            </button>
          </form>
          <AdminDepositTable
            deposits={workflow.deposits}
            selectedDepositId={workflow.selectedDepositId}
            isLoading={workflow.isLoadingDeposits}
            onSelectDeposit={workflow.selectDeposit}
          />
          {workflow.selectedDeposit ? (
            <AdminDepositDetailPanel
              deposit={workflow.selectedDeposit}
              isSubmitting={workflow.isSubmitting}
              onConfirm={() => workflow.openActionModal("confirm-deposit")}
            />
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Withdrawals</h2>
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              workflow.addWithdrawalToWatchList(workflow.lookupWithdrawalId);
            }}
          >
            <div className="min-w-[16rem] flex-1">
              <AuthFormField
                id="admin-withdrawal-lookup"
                label="Load withdrawal by ID"
                value={workflow.lookupWithdrawalId}
                onChange={(event) => workflow.setLookupWithdrawalId(event.target.value)}
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Add to table
            </button>
          </form>
          <AdminWithdrawalTable
            withdrawals={workflow.withdrawals}
            selectedWithdrawalId={workflow.selectedWithdrawalId}
            isLoading={workflow.isLoadingWithdrawals}
            onSelectWithdrawal={workflow.selectWithdrawal}
          />
          {workflow.selectedWithdrawal ? (
            <AdminWithdrawalDetailPanel
              withdrawal={workflow.selectedWithdrawal}
              isSubmitting={workflow.isSubmitting}
              onApprove={() => workflow.openActionModal("approve-withdrawal")}
              onReject={() => workflow.openActionModal("reject-withdrawal")}
              onComplete={() => workflow.openActionModal("complete-withdrawal")}
            />
          ) : null}
        </section>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "confirm-deposit"}
          title="Confirm deposit"
          description="Confirm the deposit after bank reconciliation. Settlement remains backend-owned."
          confirmLabel="Confirm deposit"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <div className="mt-4 grid gap-3">
            <AuthFormField
              id="admin-deposit-bank-reference"
              label="Bank reference"
              value={workflow.bankReference}
              onChange={(event) => workflow.setBankReference(event.target.value)}
              required
            />
            <AuthFormField
              id="admin-deposit-reconciliation-reference"
              label="Reconciliation reference"
              value={workflow.reconciliationReference}
              onChange={(event) => workflow.setReconciliationReference(event.target.value)}
            />
          </div>
        </AdminActionConfirmationModal>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "approve-withdrawal"}
          title="Approve withdrawal"
          description="Approve the withdrawal for payout processing. Wallet lock release and settlement remain backend-owned."
          confirmLabel="Confirm approval"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        />

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "reject-withdrawal"}
          title="Reject withdrawal"
          description="Reject the withdrawal and release the wallet lock according to backend rules."
          confirmLabel="Confirm rejection"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        />

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "complete-withdrawal"}
          title="Complete withdrawal payout"
          description="Record the bank transfer reference after payout execution. Settlement remains backend-owned."
          confirmLabel="Confirm completion"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <div className="mt-4 grid gap-3">
            <AuthFormField
              id="admin-withdrawal-transfer-reference"
              label="Bank transfer reference"
              value={workflow.bankTransferReference}
              onChange={(event) => workflow.setBankTransferReference(event.target.value)}
              required
            />
            <AuthFormField
              id="admin-withdrawal-reconciliation-reference"
              label="Reconciliation reference"
              value={workflow.reconciliationReference}
              onChange={(event) => workflow.setReconciliationReference(event.target.value)}
            />
          </div>
        </AdminActionConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
