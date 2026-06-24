import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as ReconciliationComponents } from "@/generated/api/reconciliation";
import { unwrapApiResponse } from "@/shared/api";

import { reconciliationClient } from "./client";
import { reconciliationQueryKeys } from "./query-keys";

type ReconciliationProblemResponse = ReconciliationComponents["schemas"]["ProblemResponse"];
type RunDetail = ReconciliationComponents["schemas"]["RunDetail"];
type MismatchDetail = ReconciliationComponents["schemas"]["MismatchDetail"];
type ReconcileWalletLedgerRequest =
  ReconciliationComponents["schemas"]["ReconcileWalletLedgerRequest"];
type ReconcileProviderExecutionRequest =
  ReconciliationComponents["schemas"]["ReconcileProviderExecutionRequest"];
type ReconcilePaymentRequest = ReconciliationComponents["schemas"]["ReconcilePaymentRequest"];
type ReconcileDeliveryRequest = ReconciliationComponents["schemas"]["ReconcileDeliveryRequest"];
type AssignMismatchRequest = ReconciliationComponents["schemas"]["AssignMismatchRequest"];
type ResolveMismatchRequest = ReconciliationComponents["schemas"]["ResolveMismatchRequest"];

export async function listReconciliationRuns(): Promise<RunDetail[]> {
  const result = await reconciliationClient.GET("/reconciliation/runs");

  return unwrapApiResponse<RunDetail[], ReconciliationProblemResponse>(
    result,
    "Unable to load reconciliation runs.",
  );
}

export async function getReconciliationRun(runId: string): Promise<RunDetail> {
  const result = await reconciliationClient.GET("/reconciliation/runs/{id}", {
    params: { path: { id: runId } },
  });

  return unwrapApiResponse<RunDetail, ReconciliationProblemResponse>(
    result,
    "Unable to load the reconciliation run.",
  );
}

export async function listReconciliationMismatches(): Promise<MismatchDetail[]> {
  const result = await reconciliationClient.GET("/reconciliation/mismatches");

  return unwrapApiResponse<MismatchDetail[], ReconciliationProblemResponse>(
    result,
    "Unable to load reconciliation mismatches.",
  );
}

export async function getReconciliationMismatch(mismatchId: string): Promise<MismatchDetail> {
  const result = await reconciliationClient.GET("/reconciliation/mismatches/{id}", {
    params: { path: { id: mismatchId } },
  });

  return unwrapApiResponse<MismatchDetail, ReconciliationProblemResponse>(
    result,
    "Unable to load the reconciliation mismatch.",
  );
}

export async function startWalletLedgerReconciliation(
  body: ReconcileWalletLedgerRequest,
): Promise<RunDetail> {
  const result = await reconciliationClient.POST("/reconciliation/runs/wallet-ledger", { body });

  return unwrapApiResponse<RunDetail, ReconciliationProblemResponse>(
    result,
    "Unable to start wallet-ledger reconciliation.",
  );
}

export async function startProviderExecutionReconciliation(
  body: ReconcileProviderExecutionRequest,
): Promise<RunDetail> {
  const result = await reconciliationClient.POST("/reconciliation/runs/provider-execution", { body });

  return unwrapApiResponse<RunDetail, ReconciliationProblemResponse>(
    result,
    "Unable to start provider-execution reconciliation.",
  );
}

export async function startPaymentReconciliation(
  body: ReconcilePaymentRequest,
): Promise<RunDetail> {
  const result = await reconciliationClient.POST("/reconciliation/runs/payment", { body });

  return unwrapApiResponse<RunDetail, ReconciliationProblemResponse>(
    result,
    "Unable to start payment reconciliation.",
  );
}

export async function startDeliveryReconciliation(
  body: ReconcileDeliveryRequest,
): Promise<RunDetail> {
  const result = await reconciliationClient.POST("/reconciliation/runs/delivery", { body });

  return unwrapApiResponse<RunDetail, ReconciliationProblemResponse>(
    result,
    "Unable to start delivery reconciliation.",
  );
}

export async function assignReconciliationMismatch(
  mismatchId: string,
  body: AssignMismatchRequest,
): Promise<MismatchDetail> {
  const result = await reconciliationClient.POST("/reconciliation/mismatches/{id}/assign", {
    params: { path: { id: mismatchId } },
    body,
  });

  return unwrapApiResponse<MismatchDetail, ReconciliationProblemResponse>(
    result,
    "Unable to assign the reconciliation mismatch.",
  );
}

export async function resolveReconciliationMismatch(
  mismatchId: string,
  body: ResolveMismatchRequest,
): Promise<MismatchDetail> {
  const result = await reconciliationClient.POST("/reconciliation/mismatches/{id}/resolve", {
    params: { path: { id: mismatchId } },
    body,
  });

  return unwrapApiResponse<MismatchDetail, ReconciliationProblemResponse>(
    result,
    "Unable to resolve the reconciliation mismatch.",
  );
}

export function useReconciliationRuns(enabled = true) {
  return useQuery({
    queryKey: reconciliationQueryKeys.runs(),
    queryFn: listReconciliationRuns,
    enabled,
  });
}

export function useReconciliationRun(runId: string | null, enabled = true) {
  return useQuery({
    queryKey: reconciliationQueryKeys.run(runId ?? "unknown"),
    queryFn: () => getReconciliationRun(runId as string),
    enabled: Boolean(runId) && enabled,
  });
}

export function useReconciliationMismatches(enabled = true) {
  return useQuery({
    queryKey: reconciliationQueryKeys.mismatches(),
    queryFn: listReconciliationMismatches,
    enabled,
  });
}

export function useReconciliationMismatch(mismatchId: string | null, enabled = true) {
  return useQuery({
    queryKey: reconciliationQueryKeys.mismatch(mismatchId ?? "unknown"),
    queryFn: () => getReconciliationMismatch(mismatchId as string),
    enabled: Boolean(mismatchId) && enabled,
  });
}

function invalidateReconciliationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: reconciliationQueryKeys.runs() }),
    queryClient.invalidateQueries({ queryKey: reconciliationQueryKeys.mismatches() }),
  ]);
}

export function useStartWalletLedgerReconciliation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startWalletLedgerReconciliation,
    onSuccess: async () => invalidateReconciliationQueries(queryClient),
  });
}

export function useStartProviderExecutionReconciliation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startProviderExecutionReconciliation,
    onSuccess: async () => invalidateReconciliationQueries(queryClient),
  });
}

export function useStartPaymentReconciliation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startPaymentReconciliation,
    onSuccess: async () => invalidateReconciliationQueries(queryClient),
  });
}

export function useStartDeliveryReconciliation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startDeliveryReconciliation,
    onSuccess: async () => invalidateReconciliationQueries(queryClient),
  });
}

export function useAssignReconciliationMismatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mismatchId,
      body,
    }: {
      mismatchId: string;
      body: AssignMismatchRequest;
    }) => assignReconciliationMismatch(mismatchId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateReconciliationQueries(queryClient),
        queryClient.invalidateQueries({
          queryKey: reconciliationQueryKeys.mismatch(variables.mismatchId),
        }),
      ]);
    },
  });
}

export function useResolveReconciliationMismatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mismatchId,
      body,
    }: {
      mismatchId: string;
      body: ResolveMismatchRequest;
    }) => resolveReconciliationMismatch(mismatchId, body),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        invalidateReconciliationQueries(queryClient),
        queryClient.invalidateQueries({
          queryKey: reconciliationQueryKeys.mismatch(variables.mismatchId),
        }),
      ]);
    },
  });
}

export type {
  AssignMismatchRequest,
  MismatchDetail,
  ReconcileDeliveryRequest,
  ReconcilePaymentRequest,
  ReconcileProviderExecutionRequest,
  ReconcileWalletLedgerRequest,
  ResolveMismatchRequest,
  RunDetail,
};
