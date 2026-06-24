import type { paths as ReconciliationPaths } from "@/generated/api/reconciliation";
import { createModuleClient } from "@/shared/api";

export const reconciliationClient = createModuleClient<ReconciliationPaths>("reconciliation");
