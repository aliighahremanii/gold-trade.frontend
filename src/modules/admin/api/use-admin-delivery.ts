import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as AdminComponents } from "@/generated/api/admin";
import { unwrapApiMutation } from "@/shared/api";

import { adminClient } from "./client";
import { adminQueryKeys } from "./query-keys";
import { deliveryQueryKeys } from "@/modules/delivery/api/query-keys";

type RejectDeliveryRequest = AdminComponents["schemas"]["RejectDeliveryRequest"];
type ScheduleDeliveryRequest = AdminComponents["schemas"]["ScheduleDeliveryRequest"];
type CompleteDeliveryRequest = AdminComponents["schemas"]["CompleteDeliveryRequest"];

export async function approveDeliveryRequest(requestId: string): Promise<void> {
  const result = await adminClient.POST("/admin/delivery/requests/{id}/approve", {
    params: { path: { id: requestId } },
  });

  unwrapApiMutation(result, "Unable to approve the delivery request.");
}

export async function rejectDeliveryRequest(
  requestId: string,
  body: RejectDeliveryRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/delivery/requests/{id}/reject", {
    params: { path: { id: requestId } },
    body,
  });

  unwrapApiMutation(result, "Unable to reject the delivery request.");
}

export async function scheduleDeliveryRequest(
  requestId: string,
  body: ScheduleDeliveryRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/delivery/requests/{id}/schedule", {
    params: { path: { id: requestId } },
    body,
  });

  unwrapApiMutation(result, "Unable to schedule the delivery request.");
}

export async function completeDeliveryRequest(
  requestId: string,
  body: CompleteDeliveryRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/delivery/requests/{id}/complete", {
    params: { path: { id: requestId } },
    body,
  });

  unwrapApiMutation(result, "Unable to complete the delivery request.");
}

export function useApproveDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDeliveryRequest,
    onSuccess: async (_data, requestId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: deliveryQueryKeys.request(requestId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.delivery() }),
      ]);
    },
  });
}

export function useRejectDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, body }: { requestId: string; body: RejectDeliveryRequest }) =>
      rejectDeliveryRequest(requestId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: deliveryQueryKeys.request(variables.requestId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.delivery() }),
      ]);
    },
  });
}

export function useScheduleDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, body }: { requestId: string; body: ScheduleDeliveryRequest }) =>
      scheduleDeliveryRequest(requestId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: deliveryQueryKeys.request(variables.requestId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.delivery() }),
      ]);
    },
  });
}

export function useCompleteDeliveryRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, body }: { requestId: string; body: CompleteDeliveryRequest }) =>
      completeDeliveryRequest(requestId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: deliveryQueryKeys.request(variables.requestId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.delivery() }),
      ]);
    },
  });
}
