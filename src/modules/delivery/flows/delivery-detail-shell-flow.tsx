import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

type DeliveryDetailShellFlowProps = {
  deliveryId: string;
};

export function DeliveryDetailShellFlow({ deliveryId }: DeliveryDetailShellFlowProps) {
  return (
    <CustomerWorkflowShell
      title="Delivery details"
      module="delivery"
      description={`Delivery ${deliveryId} status and scheduling will load from backend delivery APIs.`}
    />
  );
}
