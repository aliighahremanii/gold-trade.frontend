"use client";

import { useMemo } from "react";

import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { ReconciliationMismatchDetailPanel } from "@/modules/reconciliation/components/reconciliation-mismatch-detail-panel";
import { ReconciliationMismatchTable } from "@/modules/reconciliation/components/reconciliation-mismatch-table";
import { ReconciliationRunDetailPanel } from "@/modules/reconciliation/components/reconciliation-run-detail-panel";
import { ReconciliationRunStarterPanel } from "@/modules/reconciliation/components/reconciliation-run-starter-panel";
import { ReconciliationRunTable } from "@/modules/reconciliation/components/reconciliation-run-table";
import { useAdminReconciliationWorkflow } from "@/modules/reconciliation/hooks/use-admin-reconciliation-workflow";
import { ApiErrorAlert } from "@/shared/errors";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { AdminRecordFilters } from "@/shared/ui/admin-record-filters";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

export function AdminReconciliationFlow() {
  const workflow = useAdminReconciliationWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = [...workflow.runs, ...workflow.mismatches]
      .map((record) => ("updatedAt" in record ? record.updatedAt : undefined))
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.runs, workflow.mismatches]);

  const isLoading =
    workflow.runsQuery.isLoading ||
    workflow.mismatchesQuery.isLoading ||
    workflow.selectedRunQuery.isLoading ||
    workflow.selectedMismatchQuery.isLoading;

  const isFetching =
    workflow.runsQuery.isFetching ||
    workflow.mismatchesQuery.isFetching ||
    workflow.selectedRunQuery.isFetching ||
    workflow.selectedMismatchQuery.isFetching;

  const isError =
    workflow.runsQuery.isError ||
    workflow.mismatchesQuery.isError ||
    workflow.selectedRunQuery.isError ||
    workflow.selectedMismatchQuery.isError;

  const errorMessage = [
    workflow.runsQuery.error,
    workflow.mismatchesQuery.error,
    workflow.selectedRunQuery.error,
    workflow.selectedMismatchQuery.error,
  ].find((error): error is Error => error instanceof Error)?.message;

  return (
    <AdminWorkflowShell
      title="Reconciliation"
      module="reconciliation"
      description="Review reconciliation runs and mismatches across wallet, provider, payment, and custody domains. Unknown or manual-review states remain visible."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Reconciliation data status"
          loadingMessage="Loading reconciliation data..."
          refreshingMessage="Refreshing reconciliation data..."
          errorFallbackMessage="Reconciliation data could not be loaded."
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          errorMessage={errorMessage}
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={workflow.refresh}
        />

        {workflow.submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Reconciliation action submitted. Refresh data to confirm backend-reported status.
          </p>
        ) : null}

        <ApiErrorAlert error={workflow.actionError} />

        <AdminRecordFilters
          filters={workflow.filters}
          onChange={workflow.setFilters}
          onReset={workflow.resetFilters}
        />

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Start comparison runs
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Comparison runs do not mutate balances or ledger postings. They report mismatches for
            operator review.
          </p>
          <ReconciliationRunStarterPanel
            isSubmitting={workflow.isSubmitting}
            onStartWalletLedger={workflow.startWalletLedger}
            onStartProviderExecution={workflow.startProviderExecution}
            onStartPayment={workflow.startPayment}
            onStartDelivery={workflow.startDelivery}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Runs</h2>
          <ReconciliationRunTable
            runs={workflow.runs}
            selectedRunId={workflow.selectedRunId}
            isLoading={workflow.runsQuery.isLoading}
            onSelectRun={workflow.selectRun}
          />
          {workflow.selectedRun ? (
            <ReconciliationRunDetailPanel run={workflow.selectedRun} />
          ) : null}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Mismatches</h2>
          <ReconciliationMismatchTable
            mismatches={workflow.mismatches}
            selectedMismatchId={workflow.selectedMismatchId}
            isLoading={workflow.mismatchesQuery.isLoading}
            onSelectMismatch={workflow.selectMismatch}
          />
          {workflow.selectedMismatch ? (
            <ReconciliationMismatchDetailPanel
              mismatch={workflow.selectedMismatch}
              isSubmitting={workflow.isSubmitting}
              onAssign={() => workflow.openActionModal("assign")}
              onResolve={() => workflow.openActionModal("resolve")}
            />
          ) : null}
        </section>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "assign"}
          title="Assign mismatch for review"
          description="Assign this mismatch to an operator without changing financial state."
          confirmLabel="Confirm assignment"
          reason={workflow.assignee}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setAssignee}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <div className="mt-4">
            <AuthFormField
              id="reconciliation-assignee"
              label="Assignee ID"
              value={workflow.assignee}
              onChange={(event) => workflow.setAssignee(event.target.value)}
            />
          </div>
        </AdminActionConfirmationModal>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "resolve"}
          title="Resolve reconciliation mismatch"
          description="Resolve or dismiss the mismatch with notes. This does not post ledger corrections from the frontend."
          confirmLabel="Confirm resolution"
          reason={workflow.resolutionNotes}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setResolutionNotes}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <label className="mt-4 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={workflow.dismissMismatch}
              onChange={(event) => workflow.setDismissMismatch(event.target.checked)}
            />
            Dismiss without further action
          </label>
        </AdminActionConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
