import type { paths as CompliancePaths } from "@/generated/api/compliance";
import { createModuleClient } from "@/shared/api";

export const complianceClient = createModuleClient<CompliancePaths>("compliance");
