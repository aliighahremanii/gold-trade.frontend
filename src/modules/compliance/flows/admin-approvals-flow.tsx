"use client";

import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { ReviewCaseDetailPanel } from "@/modules/compliance/components/review-case-detail-panel";
import { ReviewCaseTable } from "@/modules/compliance/components/review-case-table";
import { useAdminApprovalsWorkflow } from "@/modules/compliance/hooks/use-admin-approvals-workflow";
import { ApiErrorAlert } from "@/shared/errors";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

export function AdminApprovalsFlow() {
  const workflow = useAdminApprovalsWorkflow();

  return (
    <AdminWorkflowShell
      title="Approvals"
      module="admin"
      description="Manual review queue from compliance review cases. Approve or reject with an explicit reason before the backend updates downstream workflows."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Manual review queue status"
          loadingMessage="Loading review cases..."
          refreshingMessage="Refreshing review cases..."
          errorFallbackMessage="Review cases could not be loaded."
          isLoading={workflow.reviewCasesQuery.isLoading}
          isFetching={workflow.reviewCasesQuery.isFetching}
          isError={workflow.reviewCasesQuery.isError}
          errorMessage={
            workflow.reviewCasesQuery.error instanceof Error
              ? workflow.reviewCasesQuery.error.message
              : undefined
          }
          onRefresh={workflow.refresh}
        />

        {workflow.submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Review action submitted. Refresh the queue to confirm backend status.
          </p>
        ) : null}

        <ApiErrorAlert error={workflow.actionError} />

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Manual review queue ({workflow.pendingQueue.length})
          </h2>
          <ReviewCaseTable
            reviewCases={workflow.pendingQueue}
            selectedCaseId={workflow.selectedCaseId}
            onSelectCase={workflow.setSelectedCaseId}
          />
        </section>

        {workflow.selectedCase ? (
          <ReviewCaseDetailPanel
            reviewCase={workflow.selectedCase}
            isSubmitting={workflow.isSubmitting}
            onApprove={workflow.openApproveModal}
            onReject={workflow.openRejectModal}
          />
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">All review cases</h2>
          <ReviewCaseTable
            reviewCases={workflow.reviewCases}
            selectedCaseId={workflow.selectedCaseId}
            onSelectCase={workflow.setSelectedCaseId}
          />
        </section>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "approve"}
          title="Confirm review approval"
          description="Approve the selected manual review case. Downstream order, payment, or delivery workflows will continue according to backend rules."
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
          isOpen={workflow.pendingAction === "reject"}
          title="Confirm review rejection"
          description="Reject the selected manual review case. The backend will keep failed, pending, or manual-review states visible to operators and customers."
          confirmLabel="Confirm rejection"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        />
      </div>
    </AdminWorkflowShell>
  );
}
