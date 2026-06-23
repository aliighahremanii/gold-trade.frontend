"use client";

import { DeliveryErrorAlert } from "@/modules/delivery/components/delivery-error-alert";
import { DeliveryStatusPanel } from "@/modules/delivery/components/delivery-status-panel";
import { useDeliveryDetailWorkflow } from "@/modules/delivery/hooks/use-request-delivery-workflow";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

type DeliveryDetailFlowProps = {
  requestId: string;
};

export function DeliveryDetailFlow({ requestId }: DeliveryDetailFlowProps) {
  const workflow = useDeliveryDetailWorkflow(requestId);

  return (
    <CustomerWorkflowShell
      title="Delivery details"
      module="delivery"
      description="Track delivery approval, scheduling, wallet locks, and settlement from backend delivery APIs."
    >
      <div className="flex flex-col gap-6">
        <DeliveryErrorAlert error={workflow.actionError} />

        {workflow.isLoading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading delivery request...</p>
        ) : null}

        {workflow.isError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
            Unable to load delivery request {requestId}.
          </p>
        ) : null}

        {workflow.requestView ? (
          <DeliveryStatusPanel
            request={workflow.requestView}
            zoneLabel={workflow.zoneLabel}
            isPolling={workflow.isPolling}
            isCancelling={workflow.isCancelling}
            onCancel={() => {
              void workflow.cancelRequest();
            }}
          />
        ) : null}
      </div>
    </CustomerWorkflowShell>
  );
}
