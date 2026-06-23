import type { RequestDetail } from "@/modules/delivery/api/use-delivery-requests";
import type { ZoneDetail } from "@/modules/delivery/api/use-delivery-zones";
import { formatMilligramsAsGrams } from "@/modules/delivery/utils/format-xau-amount";
import { getDeliveryStatusLabel } from "@/modules/delivery/utils/delivery-status";

export type DeliveryRequestStatusView = {
  requestId: string;
  amountLabel: string;
  assetCode: string;
  status: string;
  statusLabel: string;
  deliveryAddress: string;
  deliveryZoneId: string;
  recipientName: string;
  recipientPhone: string;
  walletLockId: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  handoverReference: string | null;
  failureReason: string | null;
  settlementId: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapDeliveryRequestToStatusView(
  request: RequestDetail,
  locale = "en-US",
): DeliveryRequestStatusView {
  return {
    requestId: request.id,
    amountLabel: formatMilligramsAsGrams(request.amount, locale),
    assetCode: request.asset_code,
    status: request.status,
    statusLabel: getDeliveryStatusLabel(request.status),
    deliveryAddress: request.delivery_address,
    deliveryZoneId: request.delivery_zone_id,
    recipientName: request.recipient_name,
    recipientPhone: request.recipient_phone,
    walletLockId: request.wallet_lock_id ?? null,
    scheduledAt: request.scheduled_at ?? null,
    completedAt: request.completed_at ?? null,
    handoverReference: request.handover_reference ?? null,
    failureReason: request.failure_reason ?? null,
    settlementId: request.settlement_id ?? null,
    createdAt: request.created_at,
    updatedAt: request.updated_at,
  };
}

export function mapZoneToLabel(zone: ZoneDetail): string {
  return `${zone.name} (${zone.city})`;
}
