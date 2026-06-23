import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as DeliveryComponents } from "@/generated/api/delivery";
import { unwrapApiResponse } from "@/shared/api";

import { deliveryClient } from "./client";
import { deliveryQueryKeys } from "./query-keys";
import { isTerminalDeliveryStatus } from "@/modules/delivery/utils/delivery-status";

type DeliveryProblemResponse = DeliveryComponents["schemas"]["ProblemResponse"];
type RequestDeliveryRequest = DeliveryComponents["schemas"]["RequestDeliveryRequest"];
type RequestDetail = DeliveryComponents["schemas"]["RequestDetail"];

const DELIVERY_POLL_INTERVAL_MS = 2_000;

export async function requestDelivery(body: RequestDeliveryRequest): Promise<RequestDetail> {
  const result = await deliveryClient.POST("/delivery/requests", { body });

  return unwrapApiResponse<RequestDetail, DeliveryProblemResponse>(
    result,
    "Unable to create the delivery request.",
  );
}

export async function getDeliveryRequest(requestId: string): Promise<RequestDetail> {
  const result = await deliveryClient.GET("/delivery/requests/{id}", {
    params: { path: { id: requestId } },
  });

  return unwrapApiResponse<RequestDetail, DeliveryProblemResponse>(
    result,
    "Unable to load the delivery request.",
  );
}

export async function cancelDeliveryRequest(requestId: string): Promise<RequestDetail> {
  const result = await deliveryClient.POST("/delivery/requests/{id}/cancel", {
    params: { path: { id: requestId } },
  });

  return unwrapApiResponse<RequestDetail, DeliveryProblemResponse>(
    result,
    "Unable to cancel the delivery request.",
  );
}

export function useRequestDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestDelivery,
    onSuccess: (request) => {
      queryClient.setQueryData(deliveryQueryKeys.request(request.id), request);
    },
  });
}

export function useDeliveryRequest(requestId: string | null, enabled = true) {
  return useQuery({
    queryKey: deliveryQueryKeys.request(requestId ?? "unknown"),
    queryFn: () => getDeliveryRequest(requestId as string),
    enabled: Boolean(requestId) && enabled,
    refetchInterval: (query) => {
      const request = query.state.data;
      if (!request || isTerminalDeliveryStatus(request.status)) {
        return false;
      }

      return DELIVERY_POLL_INTERVAL_MS;
    },
  });
}

export function useCancelDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelDeliveryRequest,
    onSuccess: (request) => {
      queryClient.setQueryData(deliveryQueryKeys.request(request.id), request);
    },
  });
}

export type { RequestDeliveryRequest, RequestDetail };
