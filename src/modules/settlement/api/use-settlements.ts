import { useQuery } from "@tanstack/react-query";

import type { components as SettlementComponents } from "@/generated/api/settlement";
import { unwrapApiResponse } from "@/shared/api";

import { settlementClient } from "./client";
import { settlementQueryKeys } from "./query-keys";

type SettlementProblemResponse = SettlementComponents["schemas"]["ProblemResponse"];
type SettlementDetail = SettlementComponents["schemas"]["SettlementDetail"];

export async function getSettlement(settlementId: string): Promise<SettlementDetail> {
  const result = await settlementClient.GET("/settlement/{id}", {
    params: { path: { id: settlementId } },
  });

  return unwrapApiResponse<SettlementDetail, SettlementProblemResponse>(
    result,
    "Unable to load settlement status.",
  );
}

export function useSettlement(settlementId: string | null, enabled = true) {
  return useQuery({
    queryKey: settlementQueryKeys.settlement(settlementId ?? "unknown"),
    queryFn: () => getSettlement(settlementId as string),
    enabled: Boolean(settlementId) && enabled,
  });
}

export type { SettlementDetail };
