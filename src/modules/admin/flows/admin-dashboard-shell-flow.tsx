import { AdminDashboardCards } from "@/modules/admin/components/admin-dashboard-cards";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

export function AdminDashboardShellFlow() {
  return (
    <AdminWorkflowShell
      title="Dashboard"
      module="admin"
      description="Backoffice overview and shortcuts to operational workflows. Counts and alerts will load from admin APIs in a later phase."
    >
      <AdminDashboardCards />
    </AdminWorkflowShell>
  );
}
