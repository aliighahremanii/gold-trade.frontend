import type { paths as QuotePaths } from "@/generated/api/quote";
import { createModuleClient } from "@/shared/api";

export const quoteClient = createModuleClient<QuotePaths>("quote");
