import type { paths as TradingPaths } from "@/generated/api/trading";
import { createModuleClient } from "@/shared/api";

export const tradingClient = createModuleClient<TradingPaths>("trading");
