"use client";

import { DeliveryConfirmationModal } from "@/modules/delivery/components/delivery-confirmation-modal";
import { DeliveryEligibilityPanel } from "@/modules/delivery/components/delivery-eligibility-panel";
import { DeliveryErrorAlert } from "@/modules/delivery/components/delivery-error-alert";
import { DeliveryRequestForm } from "@/modules/delivery/components/delivery-request-form";
import { DeliverySessionList } from "@/modules/delivery/components/delivery-session-list";
import { DeliveryStatusPanel } from "@/modules/delivery/components/delivery-status-panel";
import { useRequestDeliveryWorkflow } from "@/modules/delivery/hooks/use-request-delivery-workflow";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function RequestDeliveryFlow() {
  const workflow = useRequestDeliveryWorkflow();

  return (
    <CustomerWorkflowShell
      title="Request delivery"
      module="delivery"
      description="Request physical gold delivery for the MVP city, see wallet eligibility and locked balances, and track backend delivery states."
    >
      <div className="flex flex-col gap-6">
        <DeliveryErrorAlert error={workflow.actionError} />

        <DeliveryEligibilityPanel
          eligibility={workflow.eligibility}
          isLoading={workflow.walletLoading}
          isError={workflow.walletError}
        />

        <DeliveryRequestForm
          amountGrams={workflow.amountGrams}
          deliveryAddress={workflow.deliveryAddress}
          recipientName={workflow.recipientName}
          recipientPhone={workflow.recipientPhone}
          deliveryZoneId={workflow.deliveryZoneId}
          zones={workflow.zones}
          zonesLoading={workflow.zonesLoading}
          zonesError={workflow.zonesError}
          isSubmitting={workflow.isSubmitting}
          onAmountGramsChange={workflow.setAmountGrams}
          onDeliveryAddressChange={workflow.setDeliveryAddress}
          onRecipientNameChange={workflow.setRecipientName}
          onRecipientPhoneChange={workflow.setRecipientPhone}
          onDeliveryZoneIdChange={workflow.setDeliveryZoneId}
          onSubmit={workflow.openConfirmationModal}
        />

        {workflow.latestRequestView ? (
          <DeliveryStatusPanel
            request={workflow.latestRequestView}
            isPolling={workflow.isPolling}
            isCancelling={workflow.isCancelling}
            onCancel={() => {
              void workflow.cancelLatestRequest();
            }}
            showDetailLink
          />
        ) : null}

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Recent delivery requests</h2>
          <DeliverySessionList requestIds={workflow.sessionRequestIds} />
        </section>
      </div>

      <DeliveryConfirmationModal
        isOpen={workflow.isConfirmModalOpen && workflow.pendingAmountMg !== null}
        amountMg={workflow.pendingAmountMg ?? 0}
        deliveryAddress={workflow.deliveryAddress.trim()}
        recipientName={workflow.recipientName.trim()}
        recipientPhone={workflow.recipientPhone.trim()}
        zone={workflow.selectedZone}
        isSubmitting={workflow.isSubmitting}
        onCancel={workflow.closeConfirmationModal}
        onConfirm={() => {
          void workflow.submitDeliveryRequest();
        }}
      />
    </CustomerWorkflowShell>
  );
}
