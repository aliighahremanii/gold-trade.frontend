import type { paths as PricingPaths } from "@/generated/api/pricing";
import { createModuleClient } from "@/shared/api";

export const pricingClient = createModuleClient<PricingPaths>("pricing");
