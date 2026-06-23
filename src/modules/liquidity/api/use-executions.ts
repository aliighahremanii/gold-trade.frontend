import { useQuery } from "@tanstack/react-query";

import type { components as LiquidityComponents } from "@/generated/api/liquidity";
import { unwrapApiResponse } from "@/shared/api";

import { liquidityClient } from "./client";
import { liquidityQueryKeys } from "./query-keys";

type LiquidityProblemResponse = LiquidityComponents["schemas"]["ProblemResponse"];
export type ExecutionDetail = LiquidityComponents["schemas"]["ExecutionDetail"];

export async function getExecution(executionId: string): Promise<ExecutionDetail> {
  const result = await liquidityClient.GET("/liquidity/executions/{id}", {
    params: { path: { id: executionId } },
  });

  return unwrapApiResponse<ExecutionDetail, LiquidityProblemResponse>(
    result,
    "Unable to load provider execution details.",
  );
}

export function useExecution(executionId: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: liquidityQueryKeys.execution(executionId ?? "unknown"),
    queryFn: () => getExecution(executionId as string),
    enabled: Boolean(executionId) && enabled,
  });
}
