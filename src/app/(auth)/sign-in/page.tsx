import { SignInFlow } from "@/modules/identity/flows/sign-in-flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const params = await searchParams;

  return <SignInFlow nextPath={params.next} reason={params.reason} />;
}
