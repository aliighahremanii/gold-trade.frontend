import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unwrapApiMutation } from "@/shared/api";

import { adminClient } from "./client";
import { adminQueryKeys } from "./query-keys";
import { tradingQueryKeys } from "@/modules/trading/api/query-keys";

export async function approveOrder(orderId: string): Promise<void> {
  const result = await adminClient.POST("/admin/trading/orders/{id}/approve", {
    params: { path: { id: orderId } },
  });

  unwrapApiMutation(result, "Unable to approve the order.");
}

export function useApproveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveOrder,
    onSuccess: async (_data, orderId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tradingQueryKeys.order(orderId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders() }),
      ]);
    },
  });
}
