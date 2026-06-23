import type { WithdrawalDetail } from "@/modules/payments/api/use-withdrawals";
import { formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";
import { getWithdrawalStatusLabel } from "@/modules/payments/utils/payment-status";

export type WithdrawalStatusView = {
  withdrawalId: string;
  amountLabel: string;
  status: string;
  statusLabel: string;
  bankAccountReference: string;
  bankTransferReference: string | null;
  walletLockId: string | null;
  failureReason: string | null;
  settlementId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export function mapWithdrawalDetailToStatusView(
  withdrawal: WithdrawalDetail,
  locale = "en-US",
): WithdrawalStatusView {
  return {
    withdrawalId: withdrawal.id,
    amountLabel: formatIrrAmount(withdrawal.amount, locale),
    status: withdrawal.status,
    statusLabel: getWithdrawalStatusLabel(withdrawal.status),
    bankAccountReference: withdrawal.bank_account_reference,
    bankTransferReference: withdrawal.bank_transfer_reference ?? null,
    walletLockId: withdrawal.wallet_lock_id ?? null,
    failureReason: withdrawal.failure_reason ?? null,
    settlementId: withdrawal.settlement_id ?? null,
    createdAt: withdrawal.created_at,
    updatedAt: withdrawal.updated_at,
    completedAt: withdrawal.completed_at ?? null,
  };
}
