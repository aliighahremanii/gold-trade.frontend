import { describe, expect, it } from "vitest";

import { mapDeliveryRequestToStatusView } from "@/modules/delivery/mappers/map-delivery-request";
import { mapXauWalletToEligibility } from "@/modules/delivery/mappers/map-delivery-eligibility";
import {
  formatMilligramsAsGrams,
  gramsInputToMilligrams,
  isValidGramsInput,
} from "@/modules/delivery/utils/format-xau-amount";
import {
  getDeliveryStatusLabel,
  isCancellableDeliveryStatus,
  isSuccessfulDeliveryStatus,
  isTerminalDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";

describe("format-xau-amount", () => {
  it("converts grams input to milligrams", () => {
    expect(gramsInputToMilligrams("2.5")).toBe(2500);
    expect(formatMilligramsAsGrams(2500)).toBe("2.5 g");
  });

  it("validates grams input", () => {
    expect(isValidGramsInput("1")).toBe(true);
    expect(isValidGramsInput("0")).toBe(false);
    expect(isValidGramsInput("")).toBe(false);
  });
});

describe("delivery status", () => {
  it("maps delivery statuses", () => {
    expect(isSuccessfulDeliveryStatus("completed")).toBe(true);
    expect(isTerminalDeliveryStatus("cancelled")).toBe(true);
    expect(isCancellableDeliveryStatus("approved")).toBe(true);
    expect(getDeliveryStatusLabel("pending_approval")).toBe("Manual review required");
  });
});

describe("mapXauWalletToEligibility", () => {
  it("maps XAU wallet balances for delivery eligibility", () => {
    const view = mapXauWalletToEligibility([
      {
        id: "acc-1",
        user_id: "user-1",
        asset_code: "XAU",
        available_balance: 5000,
        locked_balance: 1000,
        total_balance: 6000,
        status: "active",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
      },
    ]);

    expect(view.hasAccount).toBe(true);
    expect(view.availableLabel).toBe("5 g");
    expect(view.lockedLabel).toBe("1 g");
  });
});

describe("mapDeliveryRequestToStatusView", () => {
  it("maps delivery request detail for display", () => {
    const view = mapDeliveryRequestToStatusView({
      id: "del-1",
      user_id: "user-1",
      asset_code: "XAU",
      amount: 3000,
      status: "approved",
      delivery_address: "123 Main St",
      delivery_zone_id: "zone-1",
      recipient_name: "Alex",
      recipient_phone: "+989121234567",
      wallet_lock_id: "lock-1",
      idempotency_key: "idem-1",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });

    expect(view.requestId).toBe("del-1");
    expect(view.amountLabel).toBe("3 g");
    expect(view.walletLockId).toBe("lock-1");
    expect(view.statusLabel).toBe("Approved");
  });
});
