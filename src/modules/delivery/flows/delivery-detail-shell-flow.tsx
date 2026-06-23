import { DeliveryDetailFlow } from "@/modules/delivery/flows/delivery-detail-flow";

type DeliveryDetailShellFlowProps = {
  deliveryId: string;
};

export function DeliveryDetailShellFlow({ deliveryId }: DeliveryDetailShellFlowProps) {
  return <DeliveryDetailFlow requestId={deliveryId} />;
}
