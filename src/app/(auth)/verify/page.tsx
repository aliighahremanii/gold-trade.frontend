import { VerifyFlow } from "@/modules/identity/flows/verify-flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; purpose?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <VerifyFlow
      channel={params.channel}
      purpose={params.purpose}
      nextPath={params.next}
    />
  );
}
