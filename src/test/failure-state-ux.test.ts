import { describe, expect, it } from "vitest";

import type { components as TradingComponents } from "@/generated/api/trading";
import { DeliveryErrorAlert } from "@/modules/delivery/components/delivery-error-alert";
import { DeliveryStatusPanel } from "@/modules/delivery/components/delivery-status-panel";
import type { DeliveryRequestStatusView } from "@/modules/delivery/mappers/map-delivery-request";
import {
  isCancelledDeliveryStatus,
  isRejectedDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";
import { PaymentErrorAlert } from "@/modules/payments/components/payment-error-alert";
import { WithdrawalStatusPanel } from "@/modules/payments/components/withdrawal-status-panel";
import { resolveDepositDisplayPhase } from "@/modules/payments/utils/deposit-workflow-phase";
import {
  isCancelledWithdrawalStatus,
  isRejectedWithdrawalStatus,
} from "@/modules/payments/utils/payment-status";
import type { WithdrawalStatusView } from "@/modules/payments/mappers/map-withdrawal-detail";
import { OrderStatusPanel } from "@/modules/trading/components/order-status-panel";
import { TradeErrorAlert } from "@/modules/trading/components/trade-error-alert";
import { resolveTradeDisplayPhase } from "@/modules/trading/utils/resolve-trade-display-phase";
import {
  DELIVERY_FAILURE_STATUSES,
  FINANCIAL_FAILURE_PROBLEMS,
  normalizeFinancialFailureProblem,
  ORDER_FAILURE_STATUSES,
  PAYMENT_FAILURE_STATUSES,
} from "@/test/fixtures/financial-failure-fixtures";

const baseDeliveryRequest: DeliveryRequestStatusView = {
  requestId: "delivery-1",
  amountLabel: "2.500 g XAU",
  assetCode: "XAU",
  status: DELIVERY_FAILURE_STATUSES.cancelled,
  statusLabel: "Cancelled",
  deliveryAddress: "Tehran",
  deliveryZoneId: "zone-1",
  recipientName: "Test User",
  recipientPhone: "+989121234567",
  walletLockId: "lock-1",
  scheduledAt: null,
  completedAt: null,
  handoverReference: null,
  settlementId: null,
  failureReason: null,
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
};

const baseWithdrawal: WithdrawalStatusView = {
  withdrawalId: "withdraw-1",
  amountLabel: "1,000,000 IRR",
  status: PAYMENT_FAILURE_STATUSES.withdrawalRejected,
  statusLabel: "Rejected",
  bankAccountReference: "IR123",
  walletLockId: "lock-2",
  bankTransferReference: null,
  settlementId: null,
  failureReason: "Compliance review rejected payout",
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
  completedAt: null,
};

const baseOrder: TradingComponents["schemas"]["OrderDetail"] = {
  id: "order-1",
  market_symbol: "XAU-IRR",
  side: "buy",
  status: ORDER_FAILURE_STATUSES.settlementPending,
  base_asset_code: "XAU",
  base_unit_code: "mg",
  base_amount: 2500,
  quote_asset_code: "IRR",
  total_quote_amount: 12_500_000,
  wallet_lock_id: "lock-3",
  user_id: "user-1",
  quote_id: "quote-1",
  price_snapshot_id: "price-1",
  idempotency_key: "idem-1",
  created_at: "2026-06-01T00:00:00.000Z",
  updated_at: "2026-06-01T00:00:00.000Z",
};

function renderGuidance(element: ReturnType<typeof TradeErrorAlert>) {
  return JSON.stringify(element);
}

describe("financial failure fixtures", () => {
  it.each([
    ["quoteExpired", "quote_expired"],
    ["insufficientBalance", "insufficient_balance"],
    ["providerUnavailable", "provider_unavailable"],
    ["settlementFailed", "settlement_failed"],
    ["paymentPending", "payment_pending"],
    ["paymentFailed", "payment_failed"],
    ["manualReviewRequired", "manual_review_required"],
    ["duplicateSubmit", "conflict"],
  ] as const)("maps %s problem codes to %s", (fixtureKey, expectedKind) => {
    const error = normalizeFinancialFailureProblem(fixtureKey);
    expect(error.kind).toBe(expectedKind);
    expect(error.message).toBe(FINANCIAL_FAILURE_PROBLEMS[fixtureKey].body.message);
  });
});

describe("resolveTradeDisplayPhase", () => {
  it("marks quote_ready as quote_expired when the backend expiry has passed", () => {
    expect(
      resolveTradeDisplayPhase({
        phase: "quote_ready",
        quoteExpiresAt: "2020-01-01T00:00:00.000Z",
        now: new Date("2026-01-01T00:00:00.000Z"),
      }),
    ).toBe("quote_expired");
  });

  it("maps backend order states to failure phases", () => {
    expect(
      resolveTradeDisplayPhase({
        phase: "order_tracking",
        orderStatus: ORDER_FAILURE_STATUSES.settlementFailed,
      }),
    ).toBe("failed");

    expect(
      resolveTradeDisplayPhase({
        phase: "order_tracking",
        orderStatus: ORDER_FAILURE_STATUSES.manualReview,
      }),
    ).toBe("manual_review_required");
  });
});

describe("resolveDepositDisplayPhase", () => {
  it("tracks pending deposits without pretending completion", () => {
    expect(
      resolveDepositDisplayPhase({
        isCreating: false,
        depositId: "dep-1",
        depositStatus: PAYMENT_FAILURE_STATUSES.depositPending,
        isQueryError: false,
        hasDepositData: true,
      }),
    ).toBe("tracking");
  });

  it("surfaces failed deposits from backend status", () => {
    expect(
      resolveDepositDisplayPhase({
        isCreating: false,
        depositId: "dep-1",
        depositStatus: PAYMENT_FAILURE_STATUSES.depositFailed,
        isQueryError: false,
        hasDepositData: true,
      }),
    ).toBe("failed");
  });
});

describe("failure-state error alerts", () => {
  it("renders trading guidance for expired quotes and duplicate submits", () => {
    const expired = renderGuidance(
      TradeErrorAlert({ error: normalizeFinancialFailureProblem("quoteExpired") }),
    );
    const duplicate = renderGuidance(
      TradeErrorAlert({ error: normalizeFinancialFailureProblem("duplicateSubmit") }),
    );

    expect(expired).toContain("Request a new quote before confirming.");
    expect(duplicate).toContain("Check order status instead of resubmitting.");
  });

  it("renders payment guidance for pending, failed, and provider errors", () => {
    const pending = renderGuidance(
      PaymentErrorAlert({ error: normalizeFinancialFailureProblem("paymentPending") }),
    );
    const failed = renderGuidance(
      PaymentErrorAlert({ error: normalizeFinancialFailureProblem("paymentFailed") }),
    );
    const provider = renderGuidance(
      PaymentErrorAlert({ error: normalizeFinancialFailureProblem("providerUnavailable") }),
    );

    expect(pending).toContain("still pending backend confirmation");
    expect(failed).toContain("start a new deposit when ready");
    expect(provider).toContain("payment provider is unavailable");
  });

  it("renders delivery guidance for manual review and duplicate submit", () => {
    const manualReview = renderGuidance(
      DeliveryErrorAlert({ error: normalizeFinancialFailureProblem("manualReviewRequired") }),
    );
    const duplicate = renderGuidance(
      DeliveryErrorAlert({ error: normalizeFinancialFailureProblem("duplicateSubmit") }),
    );

    expect(manualReview).toContain("requires manual review");
    expect(duplicate).toContain("Check request status instead of resubmitting");
  });
});

describe("failure-state status panels", () => {
  it("shows settlement pending messaging without success copy", () => {
    const element = OrderStatusPanel({ order: baseOrder, isPolling: true });
    const serialized = JSON.stringify(element);

    expect(serialized).toContain("Settlement is still in progress");
    expect(serialized).not.toContain("Wallet balances were refreshed");
  });

  it("shows cancelled and rejected delivery terminal messaging", () => {
    expect(isCancelledDeliveryStatus(DELIVERY_FAILURE_STATUSES.cancelled)).toBe(true);
    expect(isRejectedDeliveryStatus(DELIVERY_FAILURE_STATUSES.rejected)).toBe(true);

    const cancelled = JSON.stringify(
      DeliveryStatusPanel({
        request: baseDeliveryRequest,
        isPolling: false,
        isCancelling: false,
      }),
    );
    const rejected = JSON.stringify(
      DeliveryStatusPanel({
        request: {
          ...baseDeliveryRequest,
          status: DELIVERY_FAILURE_STATUSES.rejected,
          statusLabel: "Rejected",
          failureReason: "Address outside service area",
        },
        isPolling: false,
        isCancelling: false,
      }),
    );

    expect(cancelled).toContain("delivery request was cancelled");
    expect(rejected).toContain("delivery request was rejected");
  });

  it("shows rejected withdrawal messaging from backend status", () => {
    expect(isRejectedWithdrawalStatus(PAYMENT_FAILURE_STATUSES.withdrawalRejected)).toBe(true);
    expect(isCancelledWithdrawalStatus(PAYMENT_FAILURE_STATUSES.withdrawalCancelled)).toBe(true);

    const rejected = JSON.stringify(
      WithdrawalStatusPanel({
        withdrawal: baseWithdrawal,
        isPolling: false,
        isCancelling: false,
      }),
    );
    const cancelled = JSON.stringify(
      WithdrawalStatusPanel({
        withdrawal: {
          ...baseWithdrawal,
          status: PAYMENT_FAILURE_STATUSES.withdrawalCancelled,
          statusLabel: "Cancelled",
          failureReason: null,
        },
        isPolling: false,
        isCancelling: false,
      }),
    );

    expect(rejected).toContain("withdrawal was rejected");
    expect(cancelled).toContain("withdrawal was cancelled");
  });
});
