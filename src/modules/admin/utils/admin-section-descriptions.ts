export const adminSectionDescriptions: Record<string, string> = {
  "/admin/pricing": "Set and review manual XAU/IRR prices. Backend pricing state is the source of truth.",
  "/admin/market-status":
    "Open or close the market and review execution status without assuming client-side outcomes.",
  "/admin/orders":
    "Review customer orders and execution states from trading APIs. Pending and failed states remain visible.",
  "/admin/approvals":
    "Review withdrawal and operational approvals that require administrator action.",
  "/admin/payments":
    "Monitor deposits, withdrawals, and payment states without optimistic balance updates.",
  "/admin/delivery":
    "Operate on physical delivery requests through approve, schedule, complete, and reject actions.",
  "/admin/ledger": "Inspect ledger entries and account effects as reported by the backend.",
  "/admin/audit": "Navigate audit events for sensitive operational actions.",
  "/admin/reconciliation":
    "Review reconciliation runs and mismatches. Unknown or manual-review states stay visible.",
};
