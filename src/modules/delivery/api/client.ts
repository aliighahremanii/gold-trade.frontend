import type { paths as DeliveryPaths } from "@/generated/api/delivery";
import { createModuleClient } from "@/shared/api";

export const deliveryClient = createModuleClient<DeliveryPaths>("delivery");
