# Frontend Scaffold Prompt


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

Create or normalize the Next.js App Router frontend scaffold using the approved module structure.

## Business constraints

- The platform starts with XAU/IRR trading.
- Users can deposit IRR, buy gold, hold balances, sell gold, withdraw IRR, and request physical delivery.
- Admins operate manual pricing, market status, approvals, delivery, audit, and reconciliation.
- Backend is the source of truth for price, quote, balance, order, settlement, payment, delivery, and ledger state.

## Deliverables

- Create route groups: (public), (auth), (customer), (admin).
- Create src/modules for identity, assets, wallet, pricing, quote, trading, settlement, payments, delivery, admin, audit, compliance, reconciliation.
- Create src/shared and src/generated placeholders.
- Add README files for each module.
- Add lint/typecheck/test/build scripts if missing.
- Do not implement real business flows yet.

## Forbidden

- Do not add unrelated features.
- Do not implement backend rules in frontend.
- Do not use fake success states for financial workflows.

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
