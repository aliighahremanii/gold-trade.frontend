import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { components as PricingComponents } from "@/generated/api/pricing";
import { unwrapApiResponse } from "@/shared/api";

import { pricingClient } from "./client";
import { pricingQueryKeys } from "./query-keys";

type PricingProblemResponse = PricingComponents["schemas"]["ProblemResponse"];
export type SelectedPriceDetail = PricingComponents["schemas"]["SelectedPriceDetail"];
export type MarketPricingStatusDetail = PricingComponents["schemas"]["MarketPricingStatusDetail"];
export type PricingPolicyDetail = PricingComponents["schemas"]["PricingPolicyDetail"];
export type PriceSnapshotDetail = PricingComponents["schemas"]["PriceSnapshotDetail"];

export async function getSelectedPrice(symbol: string): Promise<SelectedPriceDetail> {
  const result = await pricingClient.GET("/pricing/markets/{symbol}/selected", {
    params: { path: { symbol } },
  });

  return unwrapApiResponse<SelectedPriceDetail, PricingProblemResponse>(
    result,
    "Unable to load the selected market price.",
  );
}

export async function getMarketPricingStatus(symbol: string): Promise<MarketPricingStatusDetail> {
  const result = await pricingClient.GET("/pricing/markets/{symbol}/status", {
    params: { path: { symbol } },
  });

  return unwrapApiResponse<MarketPricingStatusDetail, PricingProblemResponse>(
    result,
    "Unable to load market pricing status.",
  );
}

export async function getPricingPolicy(symbol: string): Promise<PricingPolicyDetail> {
  const result = await pricingClient.GET("/pricing/markets/{symbol}/policy", {
    params: { path: { symbol } },
  });

  return unwrapApiResponse<PricingPolicyDetail, PricingProblemResponse>(
    result,
    "Unable to load pricing policy.",
  );
}

export async function listMarketPrices(
  symbol: string,
  limit = 5,
): Promise<PriceSnapshotDetail[]> {
  const result = await pricingClient.GET("/pricing/markets/{symbol}/prices", {
    params: {
      path: { symbol },
      query: { limit: String(limit) },
    },
  });

  return unwrapApiResponse<PriceSnapshotDetail[], PricingProblemResponse>(
    result,
    "Unable to load recent price snapshots.",
  );
}

export function useSelectedPrice(symbol: string, enabled = true) {
  return useQuery({
    queryKey: pricingQueryKeys.selectedPrice(symbol),
    queryFn: () => getSelectedPrice(symbol),
    enabled,
    retry: (failureCount, error) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error.status === 404 || error.status === 409)
      ) {
        return false;
      }

      return failureCount < 2;
    },
  });
}

export function useMarketPricingStatus(symbol: string, enabled = true) {
  return useQuery({
    queryKey: pricingQueryKeys.marketStatus(symbol),
    queryFn: () => getMarketPricingStatus(symbol),
    enabled,
  });
}

export function usePricingPolicy(symbol: string, enabled = true) {
  return useQuery({
    queryKey: pricingQueryKeys.pricingPolicy(symbol),
    queryFn: () => getPricingPolicy(symbol),
    enabled,
  });
}

export function useMarketPrices(symbol: string, limit = 5, enabled = true) {
  return useQuery({
    queryKey: pricingQueryKeys.marketPrices(symbol, limit),
    queryFn: () => listMarketPrices(symbol, limit),
    enabled,
  });
}

export function useInvalidateMarketPricing(symbol: string) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: pricingQueryKeys.selectedPrice(symbol) }),
      queryClient.invalidateQueries({ queryKey: pricingQueryKeys.marketStatus(symbol) }),
      queryClient.invalidateQueries({ queryKey: pricingQueryKeys.marketPrices(symbol) }),
    ]);
  };
}

export function getPricingQueryErrorMessage(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: string }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return undefined;
}

export function isSelectedPriceUnavailableError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    ((error as { status: number }).status === 404 || (error as { status: number }).status === 409)
  );
}
