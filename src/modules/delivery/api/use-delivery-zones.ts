import { useQuery } from "@tanstack/react-query";

import type { components as DeliveryComponents } from "@/generated/api/delivery";
import { unwrapApiResponse } from "@/shared/api";

import { deliveryClient } from "./client";
import { deliveryQueryKeys } from "./query-keys";

type DeliveryProblemResponse = DeliveryComponents["schemas"]["ProblemResponse"];
type ZoneDetail = DeliveryComponents["schemas"]["ZoneDetail"];

export async function listDeliveryZones(): Promise<ZoneDetail[]> {
  const result = await deliveryClient.GET("/delivery/zones");

  return unwrapApiResponse<ZoneDetail[], DeliveryProblemResponse>(
    result,
    "Unable to load delivery zones.",
  );
}

export function useDeliveryZones() {
  return useQuery({
    queryKey: deliveryQueryKeys.zones(),
    queryFn: listDeliveryZones,
  });
}

export type { ZoneDetail };
