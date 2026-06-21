import { DeliveryDetailShellFlow } from "@/modules/delivery/flows/delivery-detail-shell-flow";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DeliveryDetailShellFlow deliveryId={id} />;
}
