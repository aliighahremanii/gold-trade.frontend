import type { Metadata } from "next";

import { AppShell } from "@/shared/layout/app-shell";
import { requireAuthenticatedSession } from "@/shared/auth/session-guard";
import { customerNav } from "@/shared/layout/customer-nav";

export const metadata: Metadata = {
  title: "Customer",
};

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticatedSession();

  return <AppShell area="customer" navItems={[...customerNav]}>{children}</AppShell>;
}
