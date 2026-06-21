# Customer App Shell Prompt


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

Implement the customer route shell and navigation for MVP workflows.

## Business constraints

- The platform starts with XAU/IRR trading.
- Users can deposit IRR, buy gold, hold balances, sell gold, withdraw IRR, and request physical delivery.
- Admins operate manual pricing, market status, approvals, delivery, audit, and reconciliation.
- Backend is the source of truth for price, quote, balance, order, settlement, payment, delivery, and ledger state.

## Deliverables

- Customer layout.
- Dashboard route.
- Navigation to wallet, buy, sell, deposit, withdraw, delivery, orders.
- Protected route handling.
- Loading/error boundaries.
- No final workflow implementation beyond shell composition.

## Forbidden

- Do not add unrelated features.
- Do not implement backend rules in frontend.
- Do not use fake success states for financial workflows.

## Validation

- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build

## Final response

Summarize:

- files changed
- routes/pages added
- modules touched
- API contracts used
- validation commands and results
- assumptions or missing backend contracts
