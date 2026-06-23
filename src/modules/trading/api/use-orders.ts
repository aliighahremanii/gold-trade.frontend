import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as TradingComponents } from "@/generated/api/trading";
import { unwrapApiResponse } from "@/shared/api";

import { tradingClient } from "./client";
import { tradingQueryKeys } from "./query-keys";
import { isTerminalOrderStatus } from "@/modules/trading/utils/order-status";

type TradingProblemResponse = TradingComponents["schemas"]["ProblemResponse"];
type CreateOrderRequest = TradingComponents["schemas"]["CreateOrderRequest"];
type OrderDetail = TradingComponents["schemas"]["OrderDetail"];

const ORDER_POLL_INTERVAL_MS = 2_000;

export async function createOrder(request: CreateOrderRequest): Promise<OrderDetail> {
  const result = await tradingClient.POST("/orders", { body: request });

  return unwrapApiResponse<OrderDetail, TradingProblemResponse>(result, "Unable to create the order.");
}

export async function getOrder(orderId: string): Promise<OrderDetail> {
  const result = await tradingClient.GET("/orders/{id}", {
    params: { path: { id: orderId } },
  });

  return unwrapApiResponse<OrderDetail, TradingProblemResponse>(result, "Unable to load the order.");
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.setQueryData(tradingQueryKeys.order(order.id), order);
    },
  });
}

export function useOrder(orderId: string | null, enabled = true) {
  return useQuery({
    queryKey: tradingQueryKeys.order(orderId ?? "unknown"),
    queryFn: () => getOrder(orderId as string),
    enabled: Boolean(orderId) && enabled,
    refetchInterval: (query) => {
      const order = query.state.data;
      if (!order || isTerminalOrderStatus(order.status)) {
        return false;
      }

      return ORDER_POLL_INTERVAL_MS;
    },
  });
}

export type { CreateOrderRequest, OrderDetail };
