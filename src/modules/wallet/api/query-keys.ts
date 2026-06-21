import { createQueryKeyFactory } from "@/shared/api";

export const walletQueryKeys = {
  ...createQueryKeyFactory("wallet"),
  myAccounts: () => ["wallet", "me", "accounts"] as const,
  myAccount: (accountId: string) => ["wallet", "me", "accounts", accountId] as const,
  myBalance: (accountId: string) => ["wallet", "me", "accounts", accountId, "balance"] as const,
  lock: (lockId: string) => ["wallet", "locks", lockId] as const,
};
