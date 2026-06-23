import { describe, expect, it } from "vitest";

import { WalletBalanceCard } from "@/modules/wallet/components/wallet-balance-card";
import type { WalletAssetBalanceView } from "@/modules/wallet/types/wallet-portfolio";

const irrBalance: WalletAssetBalanceView = {
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
};

describe("WalletBalanceCard", () => {
  it("renders available, locked, and total amounts with units", () => {
    const element = WalletBalanceCard({ asset: irrBalance });
    const serialized = JSON.stringify(element);

    expect(serialized).toContain("500,000");
    expect(serialized).toContain("100,000");
    expect(serialized).toContain("600,000");
    expect(serialized).toContain("IRR");
    expect(serialized).toContain("Available");
    expect(serialized).toContain("Locked");
    expect(serialized).toContain("Total");
  });

  it("shows non-active account status", () => {
    const element = WalletBalanceCard({
      asset: {
        ...irrBalance,
        status: "suspended",
      },
    });

    expect(JSON.stringify(element)).toContain("suspended");
  });
});
