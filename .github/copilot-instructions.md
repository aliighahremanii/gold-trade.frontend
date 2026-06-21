# Project Instructions for GitHub Copilot — Frontend

This file is the canonical instruction source for coding agents working on the Trade Platform frontend.

Keep these files aligned with this document:

- `.github/copilot-instructions.md`
- `.cursor/rules/frontend-architecture.mdc`
- `CODEX.md`
- `CLAUDE.md`

## Repository Identity

This repository is the **Next.js App Router frontend** for a financial trading and custody platform.

The backend is a Go modular monolith with strict bounded contexts: `identity`, `notification`, `asset`, `ledger`, `wallet`, `pricing`, `quote`, `liquidity`, `trading`, `settlement`, `payments`, `delivery`, `admin`, `audit`, `compliance`, and `reconciliation`.

The frontend must reflect these business workflows clearly without duplicating backend rules.

## Non-Negotiable Rules

- Do not implement backend business rules in the frontend.
- Do not calculate final prices, fees, wallet balances, settlement outcomes, or ledger effects on the client.
- Do not mutate displayed financial balances optimistically after money-moving actions.
- Do not store wallet balances, orders, quotes, payments, delivery status, or reconciliation state in global client stores as source of truth.
- Do not hand-write API response types when generated OpenAPI types exist.
- Do not invent endpoints that do not exist in the backend contract.
- Do not hide pending, failed, expired, manual-review, or unknown states.
- Do not put business workflow logic directly inside `src/app/**/page.tsx`.
- Do not put module-specific components in `src/shared`.
- Do not import from another module's internal implementation folders.
- Do not store auth tokens in `localStorage` unless the project has explicitly accepted that risk.
- Do not expose server secrets through `NEXT_PUBLIC_*`.

## Architecture

Use this structure:

```text
src/
  app/
    (public)/
    (auth)/
    (customer)/
    (admin)/
  modules/
    identity/
    assets/
    wallet/
    pricing/
    quote/
    trading/
    payments/
    delivery/
    admin/
    audit/
    reconciliation/
    compliance/
  shared/
    api/
    auth/
    config/
    errors/
    forms/
    layout/
    lib/
    ui/
    utils/
  generated/
    api/
```

`src/app` is only for routing, layouts, metadata, and composition.

A page should usually look like:

```tsx
import { BuyGoldFlow } from '@/modules/trading/flows/buy-gold-flow';

export default function Page() {
  return <BuyGoldFlow />;
}
```

## Module Structure

Each frontend module should prefer:

```text
src/modules/{module}/
  api/          # query keys, hooks, mutation wrappers around generated client
  components/   # module-specific UI pieces
  flows/        # page-level workflow components
  forms/        # module-specific form models and form components
  hooks/        # module-specific hooks
  mappers/      # mapping generated DTOs to view models when needed
  types/        # frontend-only view types; not API duplicates
  utils/        # module-specific helpers only
  README.md
```

## State Management

- Use TanStack Query for server state.
- Use React Hook Form for form state.
- Use URL/search params for shareable filters and table state when appropriate.
- Use Zustand only for local UI state such as sidebar state, temporary wizard state, or client-only preferences.
- Never use Zustand/Redux as the source of truth for balances, orders, quotes, payments, delivery, settlement, audit, or reconciliation.

## Financial UX Rules

Every money-moving workflow must show explicit states:

- idle
- loading
- quote_ready
- quote_expired
- confirming
- pending
- balance_locked
- executing
- settlement_pending
- settled
- failed
- manual_review_required
- unknown / needs_support

No financial workflow may pretend to be complete until the backend says it is complete.

## API Contract Rules

- Use generated OpenAPI client/types.
- Keep query keys deterministic and module-owned.
- Every mutation must handle typed errors and problem details.
- Every money-moving mutation must support idempotency if the backend contract exposes it.
- Regenerate API clients when backend OpenAPI changes.
- Add contract drift checks in CI.

## Testing Rules

- Unit-test domain-critical formatters, mappers, and state reducers.
- Component-test important forms and state displays.
- Use Playwright for end-to-end happy path and failure-state workflows.
- Prefer backend-real E2E for final MVP validation.
- Use MSW only for isolated frontend development and failure-state simulation.

## Security Rules

- Protect admin route groups.
- Use server-side session validation where possible.
- Keep authentication decisions explicit.
- Never rely only on hidden UI to protect admin actions.
- Never log sensitive identity, payment, token, or wallet data.
- Add CSP and security headers in deployment.

## Documentation Policy

Update the nearest docs when changing:

- routes or page flows
- API contracts or generated client behavior
- auth/session handling
- financial workflow states
- admin workflows
- environment variables
- CI/CD or deployment behavior
- testing strategy

## Command Policy

This repository uses Bun.

Recommended validation commands:

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
bun run build
```
