"use client";

import { useMemo } from "react";

import { AuthFormField } from "@/modules/identity/components/auth-form-field";
import { AdminActionConfirmationModal } from "@/modules/admin/components/admin-action-confirmation-modal";
import { ApiErrorAlert } from "@/shared/errors";
import { DataRefreshStatus } from "@/shared/ui/data-refresh-status";
import { formatTimestamp } from "@/shared/utils/format-timestamp";
import { AdminOrderDetailPanel } from "@/modules/trading/components/admin-order-detail-panel";
import { AdminOrderTable } from "@/modules/trading/components/admin-order-table";
import { useAdminOrdersWorkflow } from "@/modules/trading/hooks/use-admin-orders-workflow";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

export function AdminOrdersFlow() {
  const workflow = useAdminOrdersWorkflow();

  const lastUpdatedLabel = useMemo(() => {
    const latest = workflow.orders
      .map((order) => order.updatedAt)
      .filter(Boolean)
      .sort()
      .at(-1);

    return latest ? formatTimestamp(latest) : undefined;
  }, [workflow.orders]);

  return (
    <AdminWorkflowShell
      title="Orders"
      module="trading"
      description="Review trade orders referenced by the manual review queue or loaded by order ID. Execution and settlement states remain backend-owned."
    >
      <div className="flex flex-col gap-6">
        <DataRefreshStatus
          title="Orders data status"
          loadingMessage="Loading orders..."
          refreshingMessage="Refreshing orders..."
          errorFallbackMessage="Orders data could not be loaded."
          isLoading={workflow.isLoadingOrders}
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
            Approval submitted. Refresh orders to confirm the backend-reported status.
          </p>
        ) : null}

        <ApiErrorAlert error={workflow.actionError} />

        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            workflow.addOrderToWatchList(workflow.lookupOrderId);
          }}
        >
          <div className="min-w-[16rem] flex-1">
            <AuthFormField
              id="admin-order-lookup"
              label="Load order by ID"
              value={workflow.lookupOrderId}
              onChange={(event) => workflow.setLookupOrderId(event.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Add to table
          </button>
        </form>

        <AdminOrderTable
          orders={workflow.orders}
          selectedOrderId={workflow.selectedOrderId}
          isLoading={workflow.isLoadingOrders}
          onSelectOrder={workflow.selectOrder}
        />

        {workflow.selectedOrder ? (
          <AdminOrderDetailPanel
            order={workflow.selectedOrder}
            isApproving={workflow.isApproving}
            onApprove={workflow.openApproveModal}
          />
        ) : null}

        <AdminActionConfirmationModal
          isOpen={workflow.isApproveModalOpen}
          title="Confirm order approval"
          description="This action requests backend execution for a manual-review order. Continue only after verifying quote, balance lock, and review context."
          confirmLabel="Confirm approval"
          reason={workflow.approvalReason}
          isSubmitting={workflow.isApproving}
          onReasonChange={workflow.setApprovalReason}
          onCancel={workflow.closeApproveModal}
          onConfirm={() => {
            void workflow.confirmApprove();
          }}
        >
          {workflow.selectedOrder ? (
            <dl className="mt-4 grid gap-2 text-sm">
              <div>
                <dt className="text-zinc-500">Order</dt>
                <dd className="font-mono text-xs text-zinc-900 dark:text-zinc-50">{workflow.selectedOrder.id}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Status</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{workflow.selectedOrder.statusLabel}</dd>
              </div>
            </dl>
          ) : null}
        </AdminActionConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
