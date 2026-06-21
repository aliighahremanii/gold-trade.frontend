import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function BuyGoldShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Buy gold"
      module="trading"
      description="Buy quotes, confirmation, and order status will follow backend quote and trading APIs."
    />
  );
}
