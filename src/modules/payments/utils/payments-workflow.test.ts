import { describe, expect, it } from "vitest";

import { mapDepositDetailToStatusView } from "@/modules/payments/mappers/map-deposit-detail";
import { parseIrrAmountInput, formatIrrAmount } from "@/modules/payments/utils/format-irr-amount";
import { resolveDepositDisplayPhase } from "@/modules/payments/utils/deposit-workflow-phase";
import {
  getDepositStatusLabel,
  getWithdrawalStatusLabel,
  isSuccessfulDepositStatus,
  isTerminalDepositStatus,
} from "@/modules/payments/utils/payment-status";
import {
  idempotencyKeyAfterSuccessfulMutation,
  resolveIdempotencyKey,
} from "@/modules/payments/utils/withdrawal-idempotency";

describe("formatIrrAmount", () => {
  it("formats whole rials", () => {
    expect(formatIrrAmount(5_000_000)).toBe("5,000,000 IRR");
  });
});

describe("parseIrrAmountInput", () => {
  it("parses comma-separated whole rials", () => {
    expect(parseIrrAmountInput("1,250,000")).toBe(1_250_000);
  });

  it("rejects invalid amounts", () => {
    expect(() => parseIrrAmountInput("0")).toThrow();
    expect(() => parseIrrAmountInput("12.5")).toThrow();
  });
});

describe("payment status", () => {
  it("maps deposit and withdrawal statuses", () => {
    expect(isSuccessfulDepositStatus("confirmed")).toBe(true);
    expect(isTerminalDepositStatus("failed")).toBe(true);
    expect(getDepositStatusLabel("pending")).toBe("Pending");
    expect(getWithdrawalStatusLabel("manual_review_required")).toBe("Manual review required");
  });
});

describe("resolveDepositDisplayPhase", () => {
  it("returns failed when backend marks the deposit failed", () => {
    expect(
      resolveDepositDisplayPhase({
        isCreating: false,
        depositId: "dep-1",
        depositStatus: "failed",
        isQueryError: false,
        hasDepositData: true,
      }),
    ).toBe("failed");
  });

  it("keeps tracking for pending deposits", () => {
    expect(
      resolveDepositDisplayPhase({
        isCreating: false,
        depositId: "dep-1",
        depositStatus: "pending",
        isQueryError: false,
        hasDepositData: true,
      }),
    ).toBe("tracking");
  });
});

describe("withdrawal idempotency", () => {
  it("reuses an existing key until success clears it", () => {
    expect(resolveIdempotencyKey(null, () => "key-1")).toBe("key-1");
    expect(resolveIdempotencyKey("key-1", () => "key-2")).toBe("key-1");
    expect(idempotencyKeyAfterSuccessfulMutation()).toBeNull();
  });
});

describe("mapDepositDetailToStatusView", () => {
  it("maps deposit detail for display", () => {
    const view = mapDepositDetailToStatusView({
      id: "dep-1",
      user_id: "user-1",
      amount: 1_000_000,
      status: "pending",
      gateway_provider: "vandar",
      payment_url: "https://pay.example",
      idempotency_key: "idem-1",
      created_at: "2026-06-01T00:00:00.000Z",
      updated_at: "2026-06-01T00:00:00.000Z",
    });

    expect(view).toMatchObject({
      depositId: "dep-1",
      amountLabel: "1,000,000 IRR",
      statusLabel: "Pending",
      paymentUrl: "https://pay.example",
    });
  });
});
