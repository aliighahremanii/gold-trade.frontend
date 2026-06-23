import { DepositIrrShellFlow } from "@/modules/payments/flows/deposit-irr-shell-flow";

type PageProps = {
  searchParams: Promise<{ depositId?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return <DepositIrrShellFlow initialDepositId={params.depositId ?? null} />;
}
