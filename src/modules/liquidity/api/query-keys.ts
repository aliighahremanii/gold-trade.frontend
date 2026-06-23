import { createQueryKeyFactory } from "@/shared/api";

export const liquidityQueryKeys = {
  ...createQueryKeyFactory("liquidity"),
  execution: (executionId: string) => ["liquidity", "executions", executionId] as const,
};
