import type { paths as AuditPaths } from "@/generated/api/audit";
import { createModuleClient } from "@/shared/api";

export const auditClient = createModuleClient<AuditPaths>("audit");
