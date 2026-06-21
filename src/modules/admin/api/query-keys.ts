import { createQueryKeyFactory } from "@/shared/api";

export const adminQueryKeys = {
  ...createQueryKeyFactory("admin"),
  manualPrices: (symbol: string) => ["admin", "pricing", "markets", symbol, "manual-prices"] as const,
  approvals: () => ["admin", "approvals"] as const,
};
