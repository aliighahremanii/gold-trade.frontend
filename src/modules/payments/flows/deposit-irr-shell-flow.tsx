import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function DepositIrrShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Deposit IRR"
      module="payments"
      description="Deposit intents and pending gateway states will follow backend payment APIs."
    />
  );
}
