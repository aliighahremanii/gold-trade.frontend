import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function SellGoldShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Sell gold"
      module="trading"
      description="Sell quotes, confirmation, and settlement status will follow backend quote and trading APIs."
    />
  );
}
