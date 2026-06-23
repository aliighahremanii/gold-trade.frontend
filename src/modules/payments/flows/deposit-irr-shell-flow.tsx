"use client";

import { DepositIrrFlow } from "@/modules/payments/flows/deposit-irr-flow";

type DepositIrrShellFlowProps = {
  initialDepositId?: string | null;
};

export function DepositIrrShellFlow({ initialDepositId = null }: DepositIrrShellFlowProps) {
  return <DepositIrrFlow initialDepositId={initialDepositId} />;
}
