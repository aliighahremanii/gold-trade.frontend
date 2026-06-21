# Buy/Sell Gold Flow Prompt


You are working inside an existing Next.js App Router frontend repository for a financial gold trading and custody platform.

Important:
- Do not redesign the backend.
- Do not invent backend business rules.
- Do not hand-write API contracts when generated OpenAPI types exist.
- Do not store server-owned financial state as client source of truth.
- Follow AGENTS.md, docs/architecture.md, docs/business-knowledge, and docs/api-contract-strategy.md.
- Keep pages thin; put workflows under src/modules/{module}/flows.
- Use backend-real states. Do not hide pending, failed, expired, manual-review, or unknown states.


## Objective

Implement customer buy and sell gold workflows using Quote, Trading, Wallet, and Settlement API contracts.

## Business constraints

- The platform starts with XAU/IRR trading.
- Users can deposit IRR, buy gold, hold balances, sell gold, withdraw IRR, and request physical delivery.
- Admins operate manual pricing, market status, approvals, delivery, audit, and reconciliation.
- Backend is the source of truth for price, quote, balance, order, settlement, payment, delivery, and ledger state.

## Deliverables

- Buy Gold flow.
- Sell Gold flow.
- Quote creation.
- Quote countdown/expiry.
- Confirmation modal.
- Order status states.
- Settlement pending/settled/failed display.
- Wallet invalidation/refetch.
- Duplicate submit protection.

## Forbidden

- Do not calculate final price on client.
- Do not confirm expired quotes.
- Do not hide manual-review/provider-failed/settlement-failed states.

## Validation

- bun run lint
- bun run typecheck
- bun run test
- bun run build

## Final response

Summarize:

- files changed
- routes/pages added
- modules touched
- API contracts used
- validation commands and results
- assumptions or missing backend contracts
