import type { paths as SettlementPaths } from "@/generated/api/settlement";
import { createModuleClient } from "@/shared/api";

export const settlementClient = createModuleClient<SettlementPaths>("settlement");
