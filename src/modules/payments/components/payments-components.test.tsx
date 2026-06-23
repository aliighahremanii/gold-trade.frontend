import { describe, expect, it } from "vitest";

import { DepositStatusPanel } from "@/modules/payments/components/deposit-status-panel";
import { PaymentErrorAlert, toNormalizedApiError } from "@/modules/payments/components/payment-error-alert";
import type { DepositStatusView } from "@/modules/payments/mappers/map-deposit-detail";

const failedDeposit: DepositStatusView = {
  depositId: "dep-failed",
  amountLabel: "1,000,000 IRR",
  status: "failed",
  statusLabel: "Failed",
  gatewayProvider: "vandar",
  paymentUrl: null,
  gatewayReference: null,
  gatewayTrackingCode: null,
  bankReference: null,
  failureReason: "Gateway declined",
  settlementId: null,
  createdAt: "2026-06-01T00:00:00.000Z",
  updatedAt: "2026-06-01T00:00:00.000Z",
  confirmedAt: null,
};

describe("PaymentErrorAlert", () => {
  it("renders insufficient balance guidance", () => {
    const element = PaymentErrorAlert({
      error: {
        kind: "insufficient_balance",
        status: 409,
        message: "Insufficient balance.",
        fieldErrors: [],
      },
    });

    expect(JSON.stringify(element)).toContain("Insufficient balance.");
  });

  it("returns null without an error", () => {
    expect(PaymentErrorAlert({ error: null })).toBeNull();
  });
});

describe("toNormalizedApiError", () => {
  it("detects normalized API errors", () => {
    expect(
      toNormalizedApiError({
        kind: "payment_failed",
        status: 422,
        message: "Payment failed.",
        fieldErrors: [],
      })?.message,
    ).toBe("Payment failed.");
  });
});

describe("DepositStatusPanel", () => {
  it("shows failed deposit messaging and restart action", () => {
    const element = DepositStatusPanel({
      deposit: failedDeposit,
      isPolling: false,
      onStartOver: () => undefined,
    });

    const serialized = JSON.stringify(element);
    expect(serialized).toContain("Gateway declined");
    expect(serialized).toContain("Start another deposit");
    expect(serialized).toContain("This deposit failed on the backend");
  });
});
