import { CustomerWorkflowShell } from "@/shared/layout/customer-workflow-shell";

export function WalletShellFlow() {
  return (
    <CustomerWorkflowShell
      title="Wallet"
      module="wallet"
      description="IRR and XAU balances, locked amounts, and portfolio overview will load from wallet APIs."
    />
  );
}
