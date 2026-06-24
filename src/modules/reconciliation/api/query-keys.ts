import { createQueryKeyFactory } from "@/shared/api";

export const reconciliationQueryKeys = {
  ...createQueryKeyFactory("reconciliation"),
  runs: () => ["reconciliation", "runs"] as const,
  run: (runId: string) => ["reconciliation", "runs", runId] as const,
  mismatches: () => ["reconciliation", "mismatches"] as const,
  mismatch: (mismatchId: string) => ["reconciliation", "mismatches", mismatchId] as const,
};
