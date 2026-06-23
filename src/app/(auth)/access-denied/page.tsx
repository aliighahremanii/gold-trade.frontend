import { AccessDeniedFlow } from "@/modules/identity/flows/access-denied-flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const params = await searchParams;

  return <AccessDeniedFlow nextPath={params.next} reason={params.reason} />;
}
