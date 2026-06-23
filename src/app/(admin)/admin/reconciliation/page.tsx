import { AdminSectionShellFlow } from "@/modules/admin/flows/admin-section-shell-flow";

export default function Page() {
  return (
    <AdminSectionShellFlow
      title="Reconciliation"
      module="reconciliation"
      href="/admin/reconciliation"
    />
  );
}
