import type { RequestDetail } from "@/modules/delivery/api/use-delivery-requests";
import { formatMilligramsAsGrams } from "@/modules/delivery/utils/format-xau-amount";
import { getDeliveryStatusLabel } from "@/modules/delivery/utils/delivery-status";

export type AdminDeliveryRequestView = {
  id: string;
  userId: string;
  amountLabel: string;
  assetCode: string;
  status: string;
  statusLabel: string;
  deliveryAddress: string;
  deliveryZoneId: string;
  recipientName: string;
  recipientPhone: string;
  approvedBy: string | null;
  walletLockId: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  handoverReference: string | null;
  settlementId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapDeliveryRequestToAdminView(
  request: RequestDetail,
  locale = "en-US",
): AdminDeliveryRequestView {
  return {
    id: request.id,
    userId: request.user_id,
    amountLabel: formatMilligramsAsGrams(request.amount, locale),
    assetCode: request.asset_code,
    status: request.status,
    statusLabel: getDeliveryStatusLabel(request.status),
    deliveryAddress: request.delivery_address,
    deliveryZoneId: request.delivery_zone_id,
    recipientName: request.recipient_name,
    recipientPhone: request.recipient_phone,
    approvedBy: request.approved_by ?? null,
    walletLockId: request.wallet_lock_id ?? null,
    scheduledAt: request.scheduled_at ?? null,
    completedAt: request.completed_at ?? null,
    handoverReference: request.handover_reference ?? null,
    settlementId: request.settlement_id ?? null,
    failureReason: request.failure_reason ?? null,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
  };
}
