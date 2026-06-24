import { createQueryKeyFactory } from "@/shared/api";

export const adminQueryKeys = {
  ...createQueryKeyFactory("admin"),
  manualPrices: (symbol: string) => ["admin", "pricing", "markets", symbol, "manual-prices"] as const,
  marketStatus: (symbol: string) => ["admin", "pricing", "markets", symbol, "status"] as const,
  orders: () => ["admin", "orders"] as const,
  approvals: () => ["admin", "approvals"] as const,
  payments: () => ["admin", "payments"] as const,
  delivery: () => ["admin", "delivery"] as const,
};
