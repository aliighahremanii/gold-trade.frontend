import { createQueryKeyFactory } from "@/shared/api";

export const deliveryQueryKeys = {
  ...createQueryKeyFactory("delivery"),
  requests: () => ["delivery", "requests"] as const,
  request: (requestId: string) => ["delivery", "requests", requestId] as const,
  zones: () => ["delivery", "zones"] as const,
};
