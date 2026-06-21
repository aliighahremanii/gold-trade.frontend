import { createQueryKeyFactory } from "@/shared/api";

export const pricingQueryKeys = {
  ...createQueryKeyFactory("pricing"),
  selectedPrice: (symbol: string) => ["pricing", "markets", symbol, "selected"] as const,
  marketStatus: (symbol: string) => ["pricing", "markets", symbol, "status"] as const,
};
