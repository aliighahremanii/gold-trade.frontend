"use client";

import { useMemo } from "react";

import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { AdminDeliveryDetailPanel } from "@/modules/delivery/components/admin-delivery-detail-panel";
import { AdminDeliveryTable } from "@/modules/delivery/components/admin-delivery-table";
import { useAdminDeliveryWorkflow } from "@/modules/delivery/hooks/use-admin-delivery-workflow";
import { ApiErrorAlert } from "@/shared/errors";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";
import { AdminRecordFilters } from "@/shared/ui/admin-record-filters";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";

export function AdminDeliveryFlow() {
  const workflow = useAdminDeliveryWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = workflow.requests
      .map((request) => request.updatedAt)
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.requests]);

  return (
    <AdminWorkflowShell
      title="Delivery"
      module="delivery"
      description="Review physical gold delivery requests referenced by the manual review queue or loaded by ID. Schedule and complete handovers through backend admin APIs."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Delivery data status"
          loadingMessage="Loading delivery requests..."
          refreshingMessage="Refreshing delivery requests..."
          errorFallbackMessage="Delivery data could not be loaded."
          isLoading={workflow.isLoadingRequests}
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
            Delivery action submitted. Refresh requests to confirm backend-reported status.
          </p>
        ) : null}

        <ApiErrorAlert error={workflow.actionError} />

        <AdminRecordFilters
          filters={workflow.filters}
          onChange={workflow.setFilters}
          onReset={workflow.resetFilters}
        />

        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            workflow.addRequestToWatchList(workflow.lookupRequestId);
          }}
        >
          <div className="min-w-[16rem] flex-1">
            <AuthFormField
              id="admin-delivery-lookup"
              label="Load delivery request by ID"
              value={workflow.lookupRequestId}
              onChange={(event) => workflow.setLookupRequestId(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Add to table
          </button>
        </form>

        <AdminDeliveryTable
          requests={workflow.requests}
          selectedRequestId={workflow.selectedRequestId}
          isLoading={workflow.isLoadingRequests}
          onSelectRequest={workflow.selectRequest}
        />

        {workflow.selectedRequest ? (
          <AdminDeliveryDetailPanel
            request={workflow.selectedRequest}
            isSubmitting={workflow.isSubmitting}
            onApprove={() => workflow.openActionModal("approve")}
            onReject={() => workflow.openActionModal("reject")}
            onSchedule={() => workflow.openActionModal("schedule")}
            onComplete={() => workflow.openActionModal("complete")}
          />
        ) : null}

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "approve"}
          title="Approve delivery request"
          description="Approve the locked delivery request so scheduling can proceed according to backend rules."
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
          title="Reject delivery request"
          description="Reject the delivery request and release the wallet lock according to backend rules."
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
          isOpen={workflow.pendingAction === "schedule"}
          title="Schedule delivery"
          description="Set the scheduled handover time reported by the backend delivery service."
          confirmLabel="Confirm schedule"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <div className="mt-4">
            <AuthFormField
              id="admin-delivery-scheduled-at"
              label="Scheduled at"
              type="datetime-local"
              value={workflow.scheduledAt}
              onChange={(event) => workflow.setScheduledAt(event.target.value)}
              required
            />
          </div>
        </AdminActionConfirmationModal>

        <AdminActionConfirmationModal
          isOpen={workflow.pendingAction === "complete"}
          title="Complete delivery handover"
          description="Record physical handover completion. Settlement remains backend-owned."
          confirmLabel="Confirm completion"
          reason={workflow.reason}
          isSubmitting={workflow.isSubmitting}
          onReasonChange={workflow.setReason}
          onCancel={workflow.closeActionModal}
          onConfirm={() => {
            void workflow.confirmAction();
          }}
        >
          <div className="mt-4">
            <AuthFormField
              id="admin-delivery-handover-reference"
              label="Handover reference"
              value={workflow.handoverReference}
              onChange={(event) => workflow.setHandoverReference(event.target.value)}
            />
          </div>
        </AdminActionConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
