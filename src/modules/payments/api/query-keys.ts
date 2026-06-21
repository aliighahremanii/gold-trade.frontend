import { createQueryKeyFactory } from "@/shared/api";

export const paymentsQueryKeys = {
  ...createQueryKeyFactory("payments"),
  deposits: () => ["payments", "deposits"] as const,
  deposit: (depositId: string) => ["payments", "deposits", depositId] as const,
  withdrawals: () => ["payments", "withdrawals"] as const,
  withdrawal: (withdrawalId: string) => ["payments", "withdrawals", withdrawalId] as const,
};
