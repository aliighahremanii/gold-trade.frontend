import { createQueryKeyFactory } from "@/shared/api";

export const ledgerQueryKeys = {
  ...createQueryKeyFactory("ledger"),
  transaction: (transactionId: string) => ["ledger", "transactions", transactionId] as const,
  accountsByOwner: (ownerId: string, ownerType: string, assetCode?: string) =>
    ["ledger", "accounts", ownerId, ownerType, assetCode ?? "all"] as const,
};
