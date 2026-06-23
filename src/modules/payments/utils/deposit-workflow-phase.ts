import {
  isFailedDepositStatus,
  isSuccessfulDepositStatus,
} from "@/modules/payments/utils/payment-status";

export type DepositDisplayPhase = "idle" | "creating" | "completed" | "failed" | "tracking";

export function resolveDepositDisplayPhase(input: {
  isCreating: boolean;
  depositId: string | null;
  depositStatus?: string;
  isQueryError: boolean;
  hasDepositData: boolean;
}): DepositDisplayPhase {
  if (input.isCreating) {
    return "creating";
  }

  if (!input.depositId) {
    return "idle";
  }

  if (input.hasDepositData && input.depositStatus && isSuccessfulDepositStatus(input.depositStatus)) {
    return "completed";
  }

  if (input.hasDepositData && input.depositStatus && isFailedDepositStatus(input.depositStatus)) {
    return "failed";
  }

  if (input.isQueryError && !input.hasDepositData) {
    return "failed";
  }

  return "tracking";
}
