import { CustomerQuickLinks } from "@/shared/layout/customer-quick-links";
import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function CustomerDashboardShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Dashboard"
      module="wallet"
      description="Customer overview and shortcuts to MVP workflows. Portfolio balances will load from wallet APIs in a later phase."
    >
      <CustomerQuickLinks />
    </CustomerWorkflowShell>
  );
}
