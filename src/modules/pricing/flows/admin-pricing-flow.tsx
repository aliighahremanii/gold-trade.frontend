"use client";

import { useMemo } from "react";

import { CurrentPricePanel } from "@/modules/pricing/components/current-price-panel";
import { ManualPriceForm } from "@/modules/pricing/components/manual-price-form";
import { PricingConfirmationModal } from "@/modules/pricing/components/pricing-confirmation-modal";
import { PricingErrorAlert } from "@/modules/pricing/components/pricing-error-alert";
import { PricingRefreshStatus } from "@/modules/pricing/components/pricing-refresh-status";
import { RecentPriceSnapshotsPanel } from "@/modules/pricing/components/recent-price-snapshots-panel";
import { useAdminPricingWorkflow } from "@/modules/pricing/hooks/use-admin-pricing-workflow";
import { getPricingQueryErrorMessage } from "@/modules/pricing/api/use-market-pricing";
import {
  mapPriceSnapshotToView,
  mapSelectedPriceToView,
} from "@/modules/pricing/mappers/map-pricing-views";
import { formatPricingTimestamp } from "@/modules/pricing/utils/format-price-amount";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

export function AdminPricingFlow() {
  const workflow = useAdminPricingWorkflow();

  const selectedPriceView = useMemo(
    () => (workflow.selectedPriceQuery.data ? mapSelectedPriceToView(workflow.selectedPriceQuery.data) : null),
    [workflow.selectedPriceQuery.data],
  );

  const snapshotViews = useMemo(
    () => (workflow.snapshotsQuery.data ?? []).map(mapPriceSnapshotToView),
    [workflow.snapshotsQuery.data],
  );

  const lastUpdatedLabel = selectedPriceView?.selectedAtLabel;

  const isLoading =
    workflow.selectedPriceQuery.isLoading ||
    workflow.policyQuery.isLoading ||
    workflow.snapshotsQuery.isLoading;

  const isFetching =
    workflow.selectedPriceQuery.isFetching ||
    workflow.policyQuery.isFetching ||
    workflow.snapshotsQuery.isFetching;

  const hasBlockingQueryError =
    workflow.policyQuery.isError ||
    (workflow.selectedPriceQuery.isError && !workflow.selectedPriceUnavailable) ||
    workflow.snapshotsQuery.isError;

  return (
    <AdminWorkflowShell
      title="Pricing"
      module="pricing"
      description="Review the backend-selected XAU/IRR price and submit manual buy/sell prices with an auditable reason and validity window."
    >
      <div className="flex flex-col gap-6">
        <PricingRefreshStatus
          isLoading={isLoading}
          isFetching={isFetching}
          isError={hasBlockingQueryError}
          errorMessage={
            workflow.policyQuery.isError
              ? getPricingQueryErrorMessage(workflow.policyQuery.error)
              : workflow.snapshotsQuery.isError
                ? getPricingQueryErrorMessage(workflow.snapshotsQuery.error)
                : getPricingQueryErrorMessage(workflow.selectedPriceQuery.error)
          }
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={workflow.refreshPricing}
        />

        {workflow.submitState === "submitted" ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-300" role="status">
            Manual price submitted. Refresh pricing data to confirm the backend-selected snapshot.
          </p>
        ) : null}

        <PricingErrorAlert error={workflow.actionError} />

        {!isLoading && workflow.selectedPriceUnavailable ? (
          <div
            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
            role="status"
          >
            {workflow.selectedPriceUnavailableMessage ??
              "No selected price is currently available for this market."}
          </div>
        ) : null}

        {!isLoading && selectedPriceView ? <CurrentPricePanel price={selectedPriceView} /> : null}

        <ManualPriceForm
          buyPrice={workflow.buyPriceInput}
          sellPrice={workflow.sellPriceInput}
          quotePerBaseUnit={workflow.quotePerBaseUnit}
          reason={workflow.reason}
          effectiveFrom={workflow.effectiveFrom}
          expiresAt={workflow.expiresAt}
          isSubmitting={workflow.isSubmitting}
          isDisabled={workflow.formDisabled}
          onBuyPriceChange={workflow.setBuyPriceInput}
          onSellPriceChange={workflow.setSellPriceInput}
          onReasonChange={workflow.setReason}
          onEffectiveFromChange={workflow.setEffectiveFrom}
          onExpiresAtChange={workflow.setExpiresAt}
          onSubmit={workflow.openConfirmation}
        />

        {!workflow.snapshotsQuery.isLoading ? (
          <RecentPriceSnapshotsPanel snapshots={snapshotViews} />
        ) : null}

        <PricingConfirmationModal
          isOpen={workflow.isConfirmModalOpen}
          title="Confirm manual price"
          description="This action records a manual price snapshot in the pricing service. Customer quotes will continue to follow backend pricing policy."
          confirmLabel="Confirm manual price"
          isSubmitting={workflow.isSubmitting}
          onCancel={workflow.closeConfirmation}
          onConfirm={() => {
            void workflow.confirmManualPrice();
          }}
        >
          {workflow.confirmationSummary ? (
            <dl className="mt-4 grid gap-2 text-sm">
              <div>
                <dt className="text-zinc-500">Buy price</dt>
                <dd className="font-mono text-zinc-900 dark:text-zinc-50">
                  {workflow.confirmationSummary.buyPriceLabel}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Sell price</dt>
                <dd className="font-mono text-zinc-900 dark:text-zinc-50">
                  {workflow.confirmationSummary.sellPriceLabel}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Quote per base unit</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">
                  {workflow.confirmationSummary.quotePerBaseUnit}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Reason</dt>
                <dd className="text-zinc-900 dark:text-zinc-50">{workflow.confirmationSummary.reason}</dd>
              </div>
              {workflow.confirmationSummary.effectiveFrom ? (
                <div>
                  <dt className="text-zinc-500">Effective from</dt>
                  <dd className="text-zinc-900 dark:text-zinc-50">
                    {formatPricingTimestamp(workflow.confirmationSummary.effectiveFrom)}
                  </dd>
                </div>
              ) : null}
              {workflow.confirmationSummary.expiresAt ? (
                <div>
                  <dt className="text-zinc-500">Expires at</dt>
                  <dd className="text-zinc-900 dark:text-zinc-50">
                    {formatPricingTimestamp(workflow.confirmationSummary.expiresAt)}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </PricingConfirmationModal>
      </div>
    </AdminWorkflowShell>
  );
}
