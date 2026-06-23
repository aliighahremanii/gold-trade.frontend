import { describe, expect, it } from "vitest";

import {
  extractOrderIdFromReviewCase,
  isPendingReviewCase,
  parseReviewCaseList,
} from "@/modules/compliance/utils/parse-review-case-response";
import { mapOrderDetailToAdminView } from "@/modules/trading/mappers/map-order-detail";
import { getOrderWorkflowLabel } from "@/modules/trading/utils/order-status";

describe("parseReviewCaseList", () => {
  it("parses array and wrapped list payloads into review case views", () => {
    const parsed = parseReviewCaseList({
      items: [
        {
          id: "case-1",
          status: "pending",
          operation_type: "trade_buy",
          business_reference: "order-1",
        },
      ],
    });

    expect(parsed).toEqual([
      {
        id: "case-1",
        status: "pending",
        operationType: "trade_buy",
        businessReference: "order-1",
        userId: undefined,
        reason: undefined,
        failureReason: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    ]);
  });
});

describe("review case helpers", () => {
  it("detects pending review statuses", () => {
    expect(isPendingReviewCase("pending")).toBe(true);
    expect(isPendingReviewCase("approved")).toBe(false);
  });

  it("extracts order ids from trade-related review cases", () => {
    expect(
      extractOrderIdFromReviewCase({
        id: "case-1",
        status: "pending",
        operationType: "trade_sell",
        businessReference: "order-99",
      }),
    ).toBe("order-99");
  });
});

describe("mapOrderDetailToAdminView", () => {
  it("maps order detail into admin display fields", () => {
    const view = mapOrderDetailToAdminView({
      id: "order-1",
      status: "manual_review_required",
      side: "buy",
      market_symbol: "XAU-IRR",
      user_id: "user-1",
      base_amount: 1000,
      base_asset_code: "XAU",
      base_unit_code: "mg",
      quote_asset_code: "IRR",
      total_quote_amount: 5000000,
      created_at: "2026-06-23T12:00:00.000Z",
      updated_at: "2026-06-23T12:05:00.000Z",
      execution_id: "exec-1",
      failure_reason: undefined,
      idempotency_key: "key-1",
      price_snapshot_id: "price-1",
      quote_id: "quote-1",
    });

    expect(view.statusLabel).toBe(getOrderWorkflowLabel("manual_review_required"));
    expect(view.executionId).toBe("exec-1");
    expect(view.totalQuoteLabel).toBe("5,000,000 IRR");
  });
});
