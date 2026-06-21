import { createQueryKeyFactory } from "@/shared/api";

export const reconciliationQueryKeys = {
  ...createQueryKeyFactory("reconciliation"),
  walletLedgerRuns: () => ["reconciliation", "runs", "wallet-ledger"] as const,
  run: (runId: string) => ["reconciliation", "runs", runId] as const,
};
