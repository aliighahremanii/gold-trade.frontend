import type { WithdrawalDetail } from "@/modules/payments/api/use-withdrawals";
import { formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";
import { getWithdrawalStatusLabel } from "@/modules/payments/utils/payment-status";

export type AdminWithdrawalView = {
  id: string;
  userId: string;
  amountLabel: string;
  status: string;
  statusLabel: string;
  bankAccountReference: string;
  bankTransferReference: string | null;
  reconciliationReference: string | null;
  approvedBy: string | null;
  walletLockId: string | null;
  settlementId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export function mapWithdrawalDetailToAdminView(
  withdrawal: WithdrawalDetail,
  locale = "en-US",
): AdminWithdrawalView {
  return {
    id: withdrawal.id,
    userId: withdrawal.user_id,
    amountLabel: formatIrrAmount(withdrawal.amount, locale),
    status: withdrawal.status,
    statusLabel: getWithdrawalStatusLabel(withdrawal.status),
    bankAccountReference: withdrawal.bank_account_reference,
    bankTransferReference: withdrawal.bank_transfer_reference ?? null,
    reconciliationReference: withdrawal.reconciliation_reference ?? null,
    approvedBy: withdrawal.approved_by ?? null,
    walletLockId: withdrawal.wallet_lock_id ?? null,
    settlementId: withdrawal.settlement_id ?? null,
    failureReason: withdrawal.failure_reason ?? null,
    createdAt: withdrawal.created_at,
    updatedAt: withdrawal.updated_at,
    completedAt: withdrawal.completed_at ?? null,
  };
}
