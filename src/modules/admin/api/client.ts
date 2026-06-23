import type { paths as AdminPaths } from "@/generated/api/admin";
import { createModuleClient } from "@/shared/api";

export const adminClient = createModuleClient<AdminPaths>("admin");
