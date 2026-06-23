import { createQueryKeyFactory } from "@/shared/api";

export const pricingQueryKeys = {
  ...createQueryKeyFactory("pricing"),
  selectedPrice: (symbol: string) => ["pricing", "markets", symbol, "selected"] as const,
  marketStatus: (symbol: string) => ["pricing", "markets", symbol, "status"] as const,
  pricingPolicy: (symbol: string) => ["pricing", "markets", symbol, "policy"] as const,
  marketPrices: (symbol: string, limit?: number) =>
    ["pricing", "markets", symbol, "prices", limit ?? "default"] as const,
};
