import type { paths as LiquidityPaths } from "@/generated/api/liquidity";
import { createModuleClient } from "@/shared/api";

export const liquidityClient = createModuleClient<LiquidityPaths>("liquidity");
