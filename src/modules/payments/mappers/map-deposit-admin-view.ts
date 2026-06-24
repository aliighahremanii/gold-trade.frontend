import type { DepositDetail } from "@/modules/payments/api/use-deposits";
import { formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";
import { getDepositStatusLabel } from "@/modules/payments/utils/payment-status";

export type AdminDepositView = {
  id: string;
  userId: string;
  amountLabel: string;
  status: string;
  statusLabel: string;
  gatewayProvider: string;
  gatewayReference: string | null;
  gatewayTrackingCode: string | null;
  bankReference: string | null;
  reconciliationReference: string | null;
  settlementId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapDepositDetailToAdminView(
  deposit: DepositDetail,
  locale = "en-US",
): AdminDepositView {
  return {
    id: deposit.id,
    userId: deposit.user_id,
    amountLabel: formatIrrAmount(deposit.amount, locale),
    status: deposit.status,
    statusLabel: getDepositStatusLabel(deposit.status),
    gatewayProvider: deposit.gateway_provider,
    gatewayReference: deposit.gateway_reference ?? null,
    gatewayTrackingCode: deposit.gateway_tracking_code ?? null,
    bankReference: deposit.bank_reference ?? null,
    reconciliationReference: deposit.reconciliation_reference ?? null,
    settlementId: deposit.settlement_id ?? null,
    failureReason: deposit.failure_reason ?? null,
    createdAt: deposit.created_at,
    updatedAt: deposit.updated_at,
  };
}
