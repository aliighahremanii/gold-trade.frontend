import { describe, expect, it } from "vitest";

import { mapWalletAccountToBalanceView } from "@/modules/wallet/mappers/map-wallet-account";
import {
  compareWalletAssets,
  formatWalletBalanceAmount,
  formatWalletBalanceBreakdown,
  getAssetDisplayName,
} from "@/modules/wallet/utils/format-wallet-balance";

describe("formatWalletBalanceAmount", () => {
  it("formats IRR amounts in rials without decimals", () => {
    expect(formatWalletBalanceAmount("IRR", 1_500_000)).toEqual({
      formatted: "1,500,000",
      unit: "IRR",
      storedUnit: "rial",
    });
  });

  it("formats XAU amounts from milligrams to grams", () => {
    expect(formatWalletBalanceAmount("XAU", 2500)).toEqual({
      formatted: "2.5",
      unit: "g",
      storedUnit: "mg",
    });
  });

  it("uses the asset code for unknown assets", () => {
    expect(formatWalletBalanceAmount("BTC", 42)).toEqual({
      formatted: "42",
      unit: "BTC",
      storedUnit: "unit",
    });
  });
});

describe("formatWalletBalanceBreakdown", () => {
  it("formats available, locked, and total consistently", () => {
    expect(
      formatWalletBalanceBreakdown("IRR", {
        available: 1000,
        locked: 250,
        total: 1250,
      }),
    ).toEqual({
      available: "1,000",
      locked: "250",
      total: "1,250",
      unit: "IRR",
      storedUnit: "rial",
    });
  });
});

describe("compareWalletAssets", () => {
  it("orders IRR before XAU", () => {
    expect(compareWalletAssets("IRR", "XAU")).toBeLessThan(0);
    expect(compareWalletAssets("XAU", "IRR")).toBeGreaterThan(0);
  });

  it("sorts unknown assets after known assets", () => {
    expect(compareWalletAssets("IRR", "BTC")).toBeLessThan(0);
  });
});

describe("getAssetDisplayName", () => {
  it("returns known asset labels", () => {
    expect(getAssetDisplayName("IRR")).toBe("Iranian Rial");
    expect(getAssetDisplayName("XAU")).toBe("Gold");
  });
});

describe("mapWalletAccountToBalanceView", () => {
  it("maps account detail into a balance view with formatted values", () => {
    const view = mapWalletAccountToBalanceView({
      id: "acc-irr",
      user_id: "user-1",
      asset_code: "IRR",
      available_balance: 500_000,
      locked_balance: 100_000,
      total_balance: 600_000,
      status: "active",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-06-01T12:30:00.000Z",
    });

    expect(view).toMatchObject({
      accountId: "acc-irr",
      assetCode: "IRR",
      assetLabel: "Iranian Rial",
      status: "active",
      balances: {
        available: 500_000,
        locked: 100_000,
        total: 600_000,
      },
      formatted: {
        available: "500,000",
        locked: "100,000",
        total: "600,000",
        unit: "IRR",
        storedUnit: "rial",
      },
      updatedAt: "2026-06-01T12:30:00.000Z",
    });
  });
});
