import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as PaymentsComponents } from "@/generated/api/payments";
import { unwrapApiResponse } from "@/shared/api";

import { paymentsClient } from "./client";
import { paymentsQueryKeys } from "./query-keys";
import { isTerminalWithdrawalStatus } from "@/modules/payments/utils/payment-status";

type PaymentsProblemResponse = PaymentsComponents["schemas"]["ProblemResponse"];
type RequestWithdrawalRequest = PaymentsComponents["schemas"]["RequestWithdrawalRequest"];
type WithdrawalDetail = PaymentsComponents["schemas"]["WithdrawalDetail"];

const WITHDRAWAL_POLL_INTERVAL_MS = 2_000;

export async function requestWithdrawal(body: RequestWithdrawalRequest): Promise<WithdrawalDetail> {
  const result = await paymentsClient.POST("/payments/withdrawals", { body });

  return unwrapApiResponse<WithdrawalDetail, PaymentsProblemResponse>(
    result,
    "Unable to request the withdrawal.",
  );
}

export async function getWithdrawal(withdrawalId: string): Promise<WithdrawalDetail> {
  const result = await paymentsClient.GET("/payments/withdrawals/{id}", {
    params: { path: { id: withdrawalId } },
  });

  return unwrapApiResponse<WithdrawalDetail, PaymentsProblemResponse>(
    result,
    "Unable to load the withdrawal.",
  );
}

export async function cancelWithdrawal(withdrawalId: string): Promise<WithdrawalDetail> {
  const result = await paymentsClient.POST("/payments/withdrawals/{id}/cancel", {
    params: { path: { id: withdrawalId } },
  });

  return unwrapApiResponse<WithdrawalDetail, PaymentsProblemResponse>(
    result,
    "Unable to cancel the withdrawal.",
  );
}

export function useRequestWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: (withdrawal) => {
      queryClient.setQueryData(paymentsQueryKeys.withdrawal(withdrawal.id), withdrawal);
    },
  });
}

export function useWithdrawal(withdrawalId: string | null, enabled = true) {
  return useQuery({
    queryKey: paymentsQueryKeys.withdrawal(withdrawalId ?? "unknown"),
    queryFn: () => getWithdrawal(withdrawalId as string),
    enabled: Boolean(withdrawalId) && enabled,
    refetchInterval: (query) => {
      const withdrawal = query.state.data;
      if (!withdrawal || isTerminalWithdrawalStatus(withdrawal.status)) {
        return false;
      }

      return WITHDRAWAL_POLL_INTERVAL_MS;
    },
  });
}

export function useCancelWithdrawal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelWithdrawal,
    onSuccess: (withdrawal) => {
      queryClient.setQueryData(paymentsQueryKeys.withdrawal(withdrawal.id), withdrawal);
    },
  });
}

export type { WithdrawalDetail, RequestWithdrawalRequest };
