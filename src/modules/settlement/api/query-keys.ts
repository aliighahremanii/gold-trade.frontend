import { createQueryKeyFactory } from "@/shared/api";

export const settlementQueryKeys = {
  ...createQueryKeyFactory("settlement"),
  settlement: (settlementId: string) => ["settlement", "settlements", settlementId] as const,
};
