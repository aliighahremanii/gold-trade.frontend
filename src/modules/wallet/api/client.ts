import type { paths as WalletPaths } from "@/generated/api/wallet";
import { createModuleClient } from "@/shared/api";

export const walletClient = createModuleClient<WalletPaths>("wallet");