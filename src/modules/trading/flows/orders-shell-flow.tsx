import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function OrdersShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Orders"
      module="trading"
      description="Order history and execution states will load from trading APIs without client-side success assumptions."
    />
  );
}
