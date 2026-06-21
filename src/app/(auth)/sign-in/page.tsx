import { SignInScaffoldFlow } from "@/modules/identity/flows/sign-in-scaffold-flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const params = await searchParams;

  return <SignInScaffoldFlow nextPath={params.next} reason={params.reason} />;
}
