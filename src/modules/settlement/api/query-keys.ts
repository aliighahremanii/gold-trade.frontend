import { createQueryKeyFactory } from "@/shared/api";

export const settlementQueryKeys = {
  ...createQueryKeyFactory("settlement"),
  tradeSettlement: (tradeId: string) => ["settlement", "trades", tradeId] as const,
};
