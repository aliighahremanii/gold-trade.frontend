import type { TradeWorkflowPhase } from "@/modules/trading/types/trade-workflow";
import {
  isManualReviewOrderStatus,
  isSettlementFailedOrderStatus,
  isSuccessfulOrderStatus,
  isTerminalOrderStatus,
} from "@/modules/trading/utils/order-status";
import { isQuoteExpired } from "@/modules/trading/utils/quote-expiry";

export function resolveTradeDisplayPhase(input: {
  phase: TradeWorkflowPhase;
  quoteExpiresAt?: string | null;
  orderStatus?: string | null;
  now?: Date;
}): TradeWorkflowPhase {
  if (input.phase === "quote_ready" && input.quoteExpiresAt && isQuoteExpired(input.quoteExpiresAt, input.now)) {
    return "quote_expired";
  }

  if (input.phase === "order_tracking" && input.orderStatus) {
    if (isSuccessfulOrderStatus(input.orderStatus)) {
      return "completed";
    }

    if (
      isSettlementFailedOrderStatus(input.orderStatus) ||
      input.orderStatus.toLowerCase() === "failed"
    ) {
      return "failed";
    }

    if (isManualReviewOrderStatus(input.orderStatus)) {
      return "manual_review_required";
    }

    if (isTerminalOrderStatus(input.orderStatus)) {
      return "unknown";
    }
  }

  return input.phase;
}
