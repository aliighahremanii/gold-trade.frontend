"use client";

import Link from "next/link";

import { MarketStatusControls } from "@/modules/pricing/components/market-status-controls";
import { MarketStatusSummaryPanel } from "@/modules/pricing/components/market-status-summary-panel";
import { PricingConfirmationModal } from "@/modules/pricing/components/pricing-confirmation-modal";
import { PricingErrorAlert } from "@/modules/pricing/components/pricing-error-alert";
import { PricingRefreshStatus } from "@/modules/pricing/components/pricing-refresh-status";
import { useAdminMarketStatusWorkflow } from "@/modules/pricing/hooks/use-admin-market-status-workflow";
import { formatPricingTimestamp } from "@/modules/pricing/utils/format-price-amount";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

export function AdminMarketStatusFlow() {
  const workflow = useAdminMarketStatusWorkflow();

  const lastUpdatedLabel = workflow.statusQuery.data
    ? formatPricingTimestamp(workflow.statusQuery.data.updated_at)
    : undefined;

  return (
    <AdminWorkflowShell
      title="Market status"
      module="pricing"
      description="Review and update XAU/IRR pricing status. Open, closed, and manual-only states are enforced by the backend."
    >
      <div className="flex flex-col gap-6">
        <PricingRefreshStatus
          isLoading={workflow.statusQuery.isLoading}
          isFetching={workflow.statusQuery.isFetching}
          isError={workflow.statusQuery.isError}
          errorMessage={workflow.statusErrorMessage}
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={workflow.refreshStatus}
        />

        {workflow.submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Market status change submitted. Refresh to confirm the backend-reported status.
          </p>
        ) : null}

        <PricingErrorAlert error={workflow.actionError} />

        {!workflow.statusQuery.isLoading && workflow.statusQuery.data ? (
          <MarketStatusSummaryPanel status={workflow.statusQuery.data} />
        ) : null}

        <MarketStatusControls
          selectedStatus={workflow.selectedStatus}
          currentStatus={workflow.currentStatus}
          isSubmitting={workflow.isSubmitting}
          isDisabled={workflow.formDisabled}
          onStatusChange={workflow.setSelectedStatus}
          onSubmit={workflow.openConfirmation}
        />

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Status changes are auditable. Review related events in{" "}
          <Link href="/admin/audit" className="font-medium text-zinc-900 underline dark:text-zinc-50">
            Audit
          </Link>
          .
        </p>

        <PricingConfirmationModal
          isOpen={workflow.isConfirmModalOpen}
          title="Confirm market status change"
          description="This action updates market pricing status in the backend and may affect quoting and provider ingest behavior."
          confirmLabel="Confirm status change"
          isSubmitting={workflow.isSubmitting}
          onCancel={workflow.closeConfirmation}
          onConfirm={() => {
            void workflow.confirmStatusChange();
          }}
        >
          <dl className="mt-4 grid gap-2 text-sm">
            <div>
              <dt className="text-zinc-500">Current status</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">
                {workflow.currentStatusLabel ?? "Unknown"}
                {workflow.currentStatus ? (
                  <span className="ml-2 font-mono text-xs text-zinc-500">({workflow.currentStatus})</span>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">New status</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">
                {workflow.targetStatusLabel ?? "Unknown"}
                {workflow.selectedStatus ? (
                  <span className="ml-2 font-mono text-xs text-zinc-500">({workflow.selectedStatus})</span>
                ) : null}
              </dd>
            </div>
          </dl>
        </PricingConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
