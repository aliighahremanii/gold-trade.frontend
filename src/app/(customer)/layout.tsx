import { AppShell } from "@/shared/layout/app-shell";
import { requireAuthenticatedSession } from "@/shared/auth/session-guard";
import { customerNav } from "@/shared/layout/customer-nav";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticatedSession("/dashboard");

  return <AppShell area="customer" navItems={[...customerNav]}>{children}</AppShell>;
}
