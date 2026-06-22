import type { Metadata } from "next";

import { AppShell } from "@/shared/layout/app-shell";
import { requireVerifiedCustomerSession } from "@/modules/identity/auth/require-verified-customer";
import { customerNav } from "@/shared/layout/customer-nav";

export const metadata: Metadata = {
  title: "Customer",
};

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireVerifiedCustomerSession();

  return <AppShell area="customer" navItems={[...customerNav]}>{children}</AppShell>;
}
