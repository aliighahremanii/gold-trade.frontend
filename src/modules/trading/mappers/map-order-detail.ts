import type { OrderDetail } from "@/modules/trading/api/use-orders";
import { formatTradeAmount, formatTradeDisplayAmount } from "@/modules/trading/utils/format-trade-amount";
import { getOrderWorkflowLabel } from "@/modules/trading/utils/order-status";

export type AdminOrderView = {
  id: string;
  status: string;
  statusLabel: string;
  side: string;
  marketSymbol: string;
  userId: string;
  quantityLabel: string;
  totalQuoteLabel: string;
  createdAt: string;
  updatedAt: string;
  executionId?: string;
  failureReason?: string;
  approvalReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  quoteId: string;
  priceSnapshotId: string;
  walletLockId?: string;
};

export function mapOrderDetailToAdminView(order: OrderDetail, locale = "en-US"): AdminOrderView {
  return {
    id: order.id,
    status: order.status,
    statusLabel: getOrderWorkflowLabel(order.status),
    side: order.side,
    marketSymbol: order.market_symbol,
    userId: order.user_id,
    quantityLabel: formatTradeDisplayAmount(order.base_amount, order.base_unit_code, locale),
    totalQuoteLabel: formatTradeAmount(order.quote_asset_code, order.total_quote_amount, locale),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    executionId: order.execution_id,
    failureReason: order.failure_reason,
    approvalReason: order.approval_reason,
    approvedAt: order.approved_at,
    approvedBy: order.approved_by,
    quoteId: order.quote_id,
    priceSnapshotId: order.price_snapshot_id,
    walletLockId: order.wallet_lock_id,
  };
}
