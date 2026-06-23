import { WithdrawIrrDetailFlow } from "@/modules/payments/flows/withdraw-irr-detail-flow";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <WithdrawIrrDetailFlow withdrawalId={id} />;
}
