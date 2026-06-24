import type { paths as LedgerPaths } from "@/generated/api/ledger";
import { createModuleClient } from "@/shared/api";

export const ledgerClient = createModuleClient<LedgerPaths>("ledger");
