import { createQueryKeyFactory } from "@/shared/api";

export const assetsQueryKeys = {
  ...createQueryKeyFactory("assets"),
  markets: () => ["assets", "markets"] as const,
  market: (symbol: string) => ["assets", "markets", symbol] as const,
};
