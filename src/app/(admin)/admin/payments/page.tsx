import { AdminSectionShellFlow } from "@/modules/admin/flows/admin-section-shell-flow";

export default function Page() {
  return (
    <AdminSectionShellFlow title="Payments" module="payments" href="/admin/payments" />
  );
}
