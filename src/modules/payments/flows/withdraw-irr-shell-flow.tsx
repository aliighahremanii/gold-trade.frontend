import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function WithdrawIrrShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Withdraw IRR"
      module="payments"
      description="Withdrawal requests and payout status will follow backend payment APIs."
    />
  );
}
