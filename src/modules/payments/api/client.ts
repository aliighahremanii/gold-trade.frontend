import type { paths as PaymentsPaths } from "@/generated/api/payments";
import { createModuleClient } from "@/shared/api";

export const paymentsClient = createModuleClient<PaymentsPaths>("payments");
