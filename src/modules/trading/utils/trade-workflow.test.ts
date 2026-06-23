import { describe, expect, it } from "vitest";

import {
  formatQuoteCountdown,
  getQuoteRemainingSeconds,
  isQuoteExpired,
} from "@/modules/trading/utils/quote-expiry";
import {
  getOrderWorkflowLabel,
  isSettlementFailedOrderStatus,
  isSettlementPendingOrderStatus,
  isTerminalOrderStatus,
} from "@/modules/trading/utils/order-status";
import { gramsInputToDisplayAmount, isValidGramsInput } from "@/modules/trading/utils/trade-market";

describe("quote expiry", () => {
  it("detects expired quotes", () => {
    expect(isQuoteExpired("2020-01-01T00:00:00.000Z", new Date("2026-01-01T00:00:00.000Z"))).toBe(true);
  });

  it("formats countdown labels", () => {
    expect(formatQuoteCountdown(125)).toBe("2:05");
  });

  it("returns zero remaining seconds after expiry", () => {
    expect(
      getQuoteRemainingSeconds("2020-01-01T00:00:00.000Z", new Date("2026-01-01T00:00:00.000Z")),
    ).toBe(0);
  });
});

describe("order status", () => {
  it("recognizes terminal and settlement states", () => {
    expect(isTerminalOrderStatus("settled")).toBe(true);
    expect(isSettlementPendingOrderStatus("settlement_pending")).toBe(true);
    expect(isSettlementFailedOrderStatus("settlement_failed")).toBe(true);
    expect(getOrderWorkflowLabel("manual_review_required")).toBe("Manual review required");
  });
});

describe("trade market", () => {
  it("converts gram input to milligram display amount", () => {
    expect(gramsInputToDisplayAmount("2.5")).toBe(2500);
  });

  it("rejects invalid gram input", () => {
    expect(isValidGramsInput("0")).toBe(false);
    expect(isValidGramsInput("abc")).toBe(false);
  });
});
