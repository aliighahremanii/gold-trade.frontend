import { describe, expect, it } from "vitest";

import {
  mapPriceSnapshotToView,
  mapSelectedPriceToView,
} from "@/modules/pricing/mappers/map-pricing-views";
import {
  formatIrrPriceAmount,
  formatPricingTimestamp,
  fromDateTimeLocalValue,
  isValidPriceValidityWindow,
  parseIrrPriceInput,
  toDateTimeLocalValue,
} from "@/modules/pricing/utils/format-price-amount";
import { formatTimestamp } from "@/shared/utils/format-timestamp";
import { formatMarketStatusLabel } from "@/modules/pricing/utils/market-status";

describe("formatIrrPriceAmount", () => {
  it("formats IRR integers with grouping", () => {
    expect(formatIrrPriceAmount(12500000)).toBe("12,500,000 IRR");
  });
});

describe("parseIrrPriceInput", () => {
  it("accepts plain and comma-separated IRR amounts", () => {
    expect(parseIrrPriceInput("12500000")).toBe(12500000);
    expect(parseIrrPriceInput("12,500,000")).toBe(12500000);
  });

  it("rejects invalid amounts", () => {
    expect(parseIrrPriceInput("")).toBeNull();
    expect(parseIrrPriceInput("12.5")).toBeNull();
    expect(parseIrrPriceInput("0")).toBeNull();
  });
});

describe("datetime helpers", () => {
  it("round-trips datetime-local values", () => {
    const iso = "2026-06-23T12:30:00.000Z";
    const local = toDateTimeLocalValue(iso);

    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    expect(fromDateTimeLocalValue(local)).toBeTruthy();
  });

  it("formats timestamps through the shared helper", () => {
    expect(formatPricingTimestamp("2026-06-23T12:00:00.000Z")).toBe(
      formatTimestamp("2026-06-23T12:00:00.000Z"),
    );
  });

  it("accepts open-ended or ordered validity windows", () => {
    expect(isValidPriceValidityWindow(undefined, "2026-06-24T12:00:00.000Z")).toBe(true);
    expect(
      isValidPriceValidityWindow("2026-06-23T12:00:00.000Z", "2026-06-24T12:00:00.000Z"),
    ).toBe(true);
    expect(
      isValidPriceValidityWindow("2026-06-24T12:00:00.000Z", "2026-06-23T12:00:00.000Z"),
    ).toBe(false);
  });
});

describe("formatMarketStatusLabel", () => {
  it("labels known backend statuses and preserves unknown values", () => {
    expect(formatMarketStatusLabel("open")).toBe("Open");
    expect(formatMarketStatusLabel("manual-only")).toBe("Manual only");
    expect(formatMarketStatusLabel("halted")).toBe("halted");
  });
});

describe("pricing view mappers", () => {
  it("maps selected price details for display", () => {
    const view = mapSelectedPriceToView({
      market_symbol: "XAU-IRR",
      market_status: "open",
      source: "manual",
      buy_price: 10000000,
      sell_price: 10100000,
      quote_per_base_unit: "mg",
      effective_from: "2026-06-23T12:00:00.000Z",
      selected_at: "2026-06-23T12:05:00.000Z",
      price_snapshot_id: "price-1",
    });

    expect(view.marketStatusLabel).toBe("Open");
    expect(view.buyPriceLabel).toBe("10,000,000 IRR");
    expect(view.priceSnapshotId).toBe("price-1");
  });

  it("maps price snapshots with audit metadata when present", () => {
    const view = mapPriceSnapshotToView({
      id: "snap-1",
      market_symbol: "XAU-IRR",
      source: "manual",
      buy_price: 10000000,
      sell_price: 10100000,
      quote_per_base_unit: "mg",
      effective_from: "2026-06-23T12:00:00.000Z",
      created_at: "2026-06-23T12:00:00.000Z",
      reason: "End-of-day adjustment",
      actor_id: "admin-1",
    });

    expect(view.reason).toBe("End-of-day adjustment");
    expect(view.actorId).toBe("admin-1");
  });
});
