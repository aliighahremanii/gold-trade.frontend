import { describe, expect, it } from "vitest";

import {
  mapAuditRecordToAdminView,
  parseAuditRecordList,
} from "@/modules/audit/mappers/parse-audit-record-response";
import { mapLedgerTransactionToAdminView } from "@/modules/ledger/mappers/map-ledger-transaction";
import {
  getReconciliationRunTypeLabel,
  mapReconciliationMismatchToView,
  mapReconciliationRunToView,
} from "@/modules/reconciliation/mappers/map-reconciliation-views";
import { isResolvableMismatchStatus } from "@/modules/reconciliation/utils/reconciliation-status";

describe("parseAuditRecordList", () => {
  it("parses array and wrapped list payloads into audit record views", () => {
    const parsed = parseAuditRecordList({
      items: [
        {
          id: "audit-1",
          action: "approve_order",
          actor_id: "admin-1",
          target_type: "order",
          target_id: "order-1",
          created_at: "2026-06-23T12:00:00.000Z",
        },
      ],
    });

    expect(parsed).toEqual([
      {
        id: "audit-1",
        action: "approve_order",
        actorId: "admin-1",
        targetType: "order",
        targetId: "order-1",
        reason: undefined,
        businessReference: undefined,
        createdAt: "2026-06-23T12:00:00.000Z",
        updatedAt: undefined,
        status: "recorded",
      },
    ]);
  });
});

describe("mapAuditRecordToAdminView", () => {
  it("collects safe reference fields for filtering", () => {
    const view = mapAuditRecordToAdminView({
      id: "audit-1",
      status: "recorded",
      actorId: "admin-1",
      action: "approve_order",
      targetId: "order-1",
    });

    expect(view.references).toEqual(["audit-1", "admin-1", "order-1", "approve_order"]);
  });
});

describe("mapLedgerTransactionToAdminView", () => {
  it("maps ledger transaction entries into display labels", () => {
    const view = mapLedgerTransactionToAdminView({
      id: "txn-1",
      transaction_type: "trade_settlement",
      description: "Buy gold settlement",
      source_module: "trading",
      source_operation_type: "order",
      source_operation_id: "order-1",
      market_symbol: "XAU-IRR",
      posted_at: "2026-06-23T12:00:00.000Z",
      idempotency_key: "key-1",
      entries: [
        {
          id: "entry-1",
          account_id: "acct-1",
          asset_code: "IRR",
          direction: "debit",
          amount: 5_000_000,
        },
      ],
    });

    expect(view.entries[0]?.amountLabel).toBe("5,000,000 IRR");
    expect(view.references).toContain("order-1");
  });
});

describe("reconciliation view mappers", () => {
  it("labels known reconciliation run types", () => {
    expect(getReconciliationRunTypeLabel("wallet_ledger")).toBe("Wallet vs ledger");
    expect(getReconciliationRunTypeLabel("payment")).toBe("Bank vs payments");
  });

  it("maps run and mismatch details for admin tables", () => {
    const run = mapReconciliationRunToView({
      id: "run-1",
      run_type: "wallet_ledger",
      status: "completed",
      mismatch_count: 1,
      started_at: "2026-06-23T12:00:00.000Z",
    });

    const mismatch = mapReconciliationMismatchToView({
      id: "mm-1",
      mismatch_type: "balance_delta",
      status: "open",
      expected_value: "100",
      actual_value: "90",
    });

    expect(run.runTypeLabel).toBe("Wallet vs ledger");
    expect(mismatch.statusLabel).toBe("open");
    expect(isResolvableMismatchStatus("open")).toBe(true);
  });
});
