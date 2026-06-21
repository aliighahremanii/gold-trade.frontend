import { AppShell } from "@/shared/layout/app-shell";
import { requireAdminSession } from "@/shared/auth/session-guard";
import { adminNav } from "@/shared/layout/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return <AppShell area="admin" navItems={[...adminNav]}>{children}</AppShell>;
}
