import { describe, expect, it } from "vitest";

import {
  extractDeliveryRequestIdFromReviewCase,
  extractDepositIdFromReviewCase,
  extractWithdrawalIdFromReviewCase,
} from "@/modules/compliance/utils/parse-review-case-response";
import type { ReviewCaseView } from "@/modules/compliance/types/review-case-view";
import {
  isApprovableWithdrawalStatus,
  isCompletableWithdrawalStatus,
  isConfirmableDepositStatus,
} from "@/modules/payments/utils/payment-status";
import {
  isCompletableDeliveryStatus,
  isSchedulableDeliveryStatus,
} from "@/modules/delivery/utils/delivery-status";
import {
  matchesAdminRecordFilters,
  parseCommaSeparatedIds,
} from "@/shared/utils/admin-record-filters";

function reviewCase(partial: Partial<ReviewCaseView>): ReviewCaseView {
  return {
    id: "case-1",
    status: "pending",
    ...partial,
  };
}

describe("compliance business reference extractors", () => {
  it("extracts deposit, withdrawal, and delivery references by operation type", () => {
    expect(
      extractDepositIdFromReviewCase(
        reviewCase({ operationType: "deposit", businessReference: "dep-1" }),
      ),
    ).toBe("dep-1");
    expect(
      extractWithdrawalIdFromReviewCase(
        reviewCase({ operationType: "withdrawal", businessReference: "wd-1" }),
      ),
    ).toBe("wd-1");
    expect(
      extractDeliveryRequestIdFromReviewCase(
        reviewCase({ operationType: "delivery", businessReference: "del-1" }),
      ),
    ).toBe("del-1");
  });
});

describe("admin record filters", () => {
  it("parses comma-separated watch lists", () => {
    expect(parseCommaSeparatedIds("a, b,a")).toEqual(["a", "b"]);
  });

  it("filters by status, user, and reference", () => {
    expect(
      matchesAdminRecordFilters(
        {
          status: "pending_approval",
          userId: "user-123",
          updatedAt: "2026-06-01T10:00:00.000Z",
          references: ["wd-1", "iban-99"],
        },
        {
          status: "pending",
          userId: "user",
          reference: "iban",
          fromDate: "",
          toDate: "",
        },
      ),
    ).toBe(true);
  });
});

describe("admin payment and delivery action status helpers", () => {
  it("identifies confirmable deposits and withdrawal actions", () => {
    expect(isConfirmableDepositStatus("awaiting_confirmation")).toBe(true);
    expect(isConfirmableDepositStatus("confirmed")).toBe(false);
    expect(isApprovableWithdrawalStatus("manual_review_required")).toBe(true);
    expect(isCompletableWithdrawalStatus("approved")).toBe(true);
  });

  it("identifies delivery scheduling and completion states", () => {
    expect(isSchedulableDeliveryStatus("approved")).toBe(true);
    expect(isCompletableDeliveryStatus("scheduled")).toBe(true);
  });
});
