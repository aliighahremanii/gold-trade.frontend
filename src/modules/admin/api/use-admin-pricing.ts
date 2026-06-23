import { useMutation } from "@tanstack/react-query";

import type { components as AdminComponents } from "@/generated/api/admin";
import { unwrapApiMutation } from "@/shared/api";

import { adminClient } from "./client";

export type SetManualPriceRequest = AdminComponents["schemas"]["SetManualPriceRequest"];
export type SetMarketStatusRequest = AdminComponents["schemas"]["SetMarketStatusRequest"];

type SetManualPriceInput = {
  symbol: string;
  body: SetManualPriceRequest;
};

type SetMarketStatusInput = {
  symbol: string;
  body: SetMarketStatusRequest;
};

export async function setManualPrice({ symbol, body }: SetManualPriceInput): Promise<void> {
  const result = await adminClient.POST("/admin/pricing/markets/{symbol}/manual-prices", {
    params: { path: { symbol } },
    body,
  });

  unwrapApiMutation(result, "Unable to set the manual market price.");
}

export async function setMarketStatus({ symbol, body }: SetMarketStatusInput): Promise<void> {
  const result = await adminClient.PUT("/admin/pricing/markets/{symbol}/status", {
    params: { path: { symbol } },
    body,
  });

  unwrapApiMutation(result, "Unable to update market pricing status.");
}

export function useSetManualPrice() {
  return useMutation({
    mutationFn: setManualPrice,
  });
}

export function useSetMarketStatus() {
  return useMutation({
    mutationFn: setMarketStatus,
  });
}
