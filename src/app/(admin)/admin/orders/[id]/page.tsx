import { AdminOrderDetailFlow } from "@/modules/trading/flows/admin-order-detail-flow";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <AdminOrderDetailFlow orderId={id} />;
}
