import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { components as AdminComponents } from "@/generated/api/admin";
import { unwrapApiMutation } from "@/shared/api";

import { adminClient } from "./client";
import { adminQueryKeys } from "./query-keys";
import { paymentsQueryKeys } from "@/modules/payments/api/query-keys";

type ConfirmDepositRequest = AdminComponents["schemas"]["ConfirmDepositRequest"];
type CompleteWithdrawalRequest = AdminComponents["schemas"]["CompleteWithdrawalRequest"];
type RejectWithdrawalRequest = AdminComponents["schemas"]["RejectWithdrawalRequest"];

export async function confirmDeposit(
  depositId: string,
  body: ConfirmDepositRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/payments/deposits/{id}/confirm", {
    params: { path: { id: depositId } },
    body,
  });

  unwrapApiMutation(result, "Unable to confirm the deposit.");
}

export async function approveWithdrawal(withdrawalId: string): Promise<void> {
  const result = await adminClient.POST("/admin/payments/withdrawals/{id}/approve", {
    params: { path: { id: withdrawalId } },
  });

  unwrapApiMutation(result, "Unable to approve the withdrawal.");
}

export async function rejectWithdrawal(
  withdrawalId: string,
  body: RejectWithdrawalRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/payments/withdrawals/{id}/reject", {
    params: { path: { id: withdrawalId } },
    body,
  });

  unwrapApiMutation(result, "Unable to reject the withdrawal.");
}

export async function completeWithdrawal(
  withdrawalId: string,
  body: CompleteWithdrawalRequest,
): Promise<void> {
  const result = await adminClient.POST("/admin/payments/withdrawals/{id}/complete", {
    params: { path: { id: withdrawalId } },
    body,
  });

  unwrapApiMutation(result, "Unable to complete the withdrawal.");
}

export function useConfirmDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ depositId, body }: { depositId: string; body: ConfirmDepositRequest }) =>
      confirmDeposit(depositId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: paymentsQueryKeys.deposit(variables.depositId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments() }),
      ]);
    },
  });
}

export function useApproveWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveWithdrawal,
    onSuccess: async (_data, withdrawalId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: paymentsQueryKeys.withdrawal(withdrawalId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments() }),
      ]);
    },
  });
}

export function useRejectWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      withdrawalId,
      body,
    }: {
      withdrawalId: string;
      body: RejectWithdrawalRequest;
    }) => rejectWithdrawal(withdrawalId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: paymentsQueryKeys.withdrawal(variables.withdrawalId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments() }),
      ]);
    },
  });
}

export function useCompleteWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      withdrawalId,
      body,
    }: {
      withdrawalId: string;
      body: CompleteWithdrawalRequest;
    }) => completeWithdrawal(withdrawalId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: paymentsQueryKeys.withdrawal(variables.withdrawalId),
        }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.payments() }),
      ]);
    },
  });
}
