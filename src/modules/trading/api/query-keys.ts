import { createQueryKeyFactory } from "@/shared/api";

export const tradingQueryKeys = {
  ...createQueryKeyFactory("trading"),
  orders: () => ["trading", "orders"] as const,
  order: (orderId: string) => ["trading", "orders", orderId] as const,
};
