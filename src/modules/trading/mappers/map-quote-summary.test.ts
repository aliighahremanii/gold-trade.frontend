import { describe, expect, it } from "vitest";

import { mapQuoteDetailToSummary } from "@/modules/trading/mappers/map-quote-summary";

describe("mapQuoteDetailToSummary", () => {
  it("maps backend quote amounts without client-side pricing", () => {
    const summary = mapQuoteDetailToSummary({
      id: "quote-1",
      user_id: "user-1",
      market_symbol: "XAU-IRR",
      side: "buy",
      status: "pending",
      display_amount: 2500,
      display_unit: "mg",
      base_amount: 2500,
      base_asset_code: "XAU",
      base_unit_code: "mg",
      quote_asset_code: "IRR",
      unit_price: 3_500_000,
      fee_amount: 50_000,
      gross_quote_amount: 8_750_000,
      total_quote_amount: 8_800_000,
      price_snapshot_id: "snap-1",
      price_source: "manual",
      quote_per_base_unit: "3500000",
      expires_at: "2026-06-01T12:30:00.000Z",
      created_at: "2026-06-01T12:29:00.000Z",
    });

    expect(summary).toMatchObject({
      quoteId: "quote-1",
      quantityLabel: "2.5 g",
      feeLabel: "50,000 IRR",
      totalIrrLabel: "8,800,000 IRR",
    });
  });
});
