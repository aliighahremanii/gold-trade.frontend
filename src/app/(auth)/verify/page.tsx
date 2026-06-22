import { VerifyOtpFlow } from "@/modules/identity/flows/verify-otp-flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ channel?: string; purpose?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <VerifyOtpFlow
      channel={params.channel}
      purpose={params.purpose}
      nextPath={params.next}
    />
  );
}
