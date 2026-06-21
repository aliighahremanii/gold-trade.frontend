import type { paths as IdentityPaths } from "@/generated/api/identity";
import { createModuleClient } from "@/shared/api";

export const identityClient = createModuleClient<IdentityPaths>("identity");