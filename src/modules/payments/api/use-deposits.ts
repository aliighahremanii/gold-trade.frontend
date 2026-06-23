import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as PaymentsComponents } from "@/generated/api/payments";
import { unwrapApiResponse } from "@/shared/api";

import { paymentsClient } from "./client";
import { paymentsQueryKeys } from "./query-keys";
import { isTerminalDepositStatus } from "@/modules/payments/utils/payment-status";

type PaymentsProblemResponse = PaymentsComponents["schemas"]["ProblemResponse"];
type RequestDepositRequest = PaymentsComponents["schemas"]["RequestDepositRequest"];
type DepositDetail = PaymentsComponents["schemas"]["DepositDetail"];

const DEPOSIT_POLL_INTERVAL_MS = 2_000;

export async function requestDeposit(body: RequestDepositRequest): Promise<DepositDetail> {
  const result = await paymentsClient.POST("/payments/deposits", { body });

  return unwrapApiResponse<DepositDetail, PaymentsProblemResponse>(
    result,
    "Unable to initiate the deposit.",
  );
}

export async function getDeposit(depositId: string): Promise<DepositDetail> {
  const result = await paymentsClient.GET("/payments/deposits/{id}", {
    params: { path: { id: depositId } },
  });

  return unwrapApiResponse<DepositDetail, PaymentsProblemResponse>(
    result,
    "Unable to load the deposit.",
  );
}

export function useRequestDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestDeposit,
    onSuccess: (deposit) => {
      queryClient.setQueryData(paymentsQueryKeys.deposit(deposit.id), deposit);
    },
  });
}

export function useDeposit(depositId: string | null, enabled = true) {
  return useQuery({
    queryKey: paymentsQueryKeys.deposit(depositId ?? "unknown"),
    queryFn: () => getDeposit(depositId as string),
    enabled: Boolean(depositId) && enabled,
    refetchInterval: (query) => {
      const deposit = query.state.data;
      if (!deposit || isTerminalDepositStatus(deposit.status)) {
        return false;
      }

      return DEPOSIT_POLL_INTERVAL_MS;
    },
  });
}

export type { DepositDetail, RequestDepositRequest };
