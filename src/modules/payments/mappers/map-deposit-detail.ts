import type { DepositDetail } from "@/modules/payments/api/use-deposits";
import { formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";
import { getDepositStatusLabel } from "@/modules/payments/utils/payment-status";

export type DepositStatusView = {
  depositId: string;
  amountLabel: string;
  status: string;
  statusLabel: string;
  gatewayProvider: string;
  paymentUrl: string | null;
  gatewayReference: string | null;
  gatewayTrackingCode: string | null;
  bankReference: string | null;
  failureReason: string | null;
  settlementId: string | null;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
};

export function mapDepositDetailToStatusView(
  deposit: DepositDetail,
  locale = "en-US",
): DepositStatusView {
  return {
    depositId: deposit.id,
    amountLabel: formatIrrAmount(deposit.amount, locale),
    status: deposit.status,
    statusLabel: getDepositStatusLabel(deposit.status),
    gatewayProvider: deposit.gateway_provider,
    paymentUrl: deposit.payment_url ?? null,
    gatewayReference: deposit.gateway_reference ?? null,
    gatewayTrackingCode: deposit.gateway_tracking_code ?? null,
    bankReference: deposit.bank_reference ?? null,
    failureReason: deposit.failure_reason ?? null,
    settlementId: deposit.settlement_id ?? null,
    createdAt: deposit.created_at,
    updatedAt: deposit.updated_at,
    confirmedAt: deposit.confirmed_at ?? null,
  };
}
