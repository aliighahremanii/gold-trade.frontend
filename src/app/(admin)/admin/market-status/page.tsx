import { AdminSectionShellFlow } from "@/modules/admin/flows/admin-section-shell-flow";

export default function Page() {
  return (
    <AdminSectionShellFlow
      title="Market status"
      module="pricing"
      href="/admin/market-status"
    />
  );
}
