import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function RequestDeliveryShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Request delivery"
      module="delivery"
      description="Physical delivery requests and lock states will follow backend delivery APIs."
    />
  );
}
