# Frontend Architecture

## Goal

Build a Next.js App Router frontend that exposes the Trade Platform workflows safely and clearly.

The frontend must be a workflow-oriented UI over the backend's bounded contexts, not a separate domain implementation.

## App Router role

`src/app` owns routing, layouts, loading/error boundaries, metadata, and route-level composition.

It must not contain business workflow logic. Business workflows live under `src/modules/{module}/flows`.

## Route groups

Recommended route groups:

```text
src/app/
  (public)/
    page.tsx
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
    verify/page.tsx
  (customer)/
    dashboard/page.tsx
    wallet/page.tsx
    trade/buy/page.tsx
    trade/sell/page.tsx
    payments/deposit/page.tsx
    payments/withdraw/page.tsx
    delivery/request/page.tsx
    delivery/[id]/page.tsx
    orders/page.tsx
  (admin)/
    dashboard/page.tsx
    pricing/page.tsx
    market-status/page.tsx
    orders/page.tsx
    approvals/page.tsx
    payments/page.tsx
    delivery/page.tsx
    ledger/page.tsx
    audit/page.tsx
    reconciliation/page.tsx
```

## Module alignment

Frontend modules should align with backend bounded contexts, but they are not backend modules. They own UI workflows, view models, form logic, query keys, and display state.

```text
Backend module       Frontend module responsibility
identity             auth pages, session UI, admin auth guard
asset                asset display, units, symbols, capability labels
wallet               balances, locked balances, portfolio overview
pricing              manual price/admin price UI, market status UI
quote                quote panels, expiry timers, quote confirmation UI
trading              buy/sell flows, order status and history
settlement           settlement status and error visibility
payments             deposit, withdrawal, payment status
 delivery             physical delivery request and admin delivery operations
admin                admin shell and operational dashboards
audit                audit log search and sensitive-operation traceability
compliance           limits, manual review, KYC/risk status visibility
reconciliation       mismatch dashboards and daily operational reports
```

## Server and client components

Default to Server Components for static layout, route-level composition, metadata, and initial server-safe reads.

Use Client Components for:

- forms
- timers
- quote countdowns
- client-side interactions
- mutation flows
- TanStack Query hooks
- rich tables and filters

## API layer

Generated OpenAPI client code lives under:

```text
src/generated/api
```

Module-owned wrappers live under:

```text
src/modules/{module}/api
```

Shared HTTP concerns live under:

```text
src/shared/api
```

Examples:

```text
src/modules/wallet/api/wallet-query-keys.ts
src/modules/wallet/api/use-wallet-balances.ts
src/modules/trading/api/use-confirm-quote.ts
```

## Import boundaries

Allowed:

- `src/app` imports `src/modules` and `src/shared`.
- A module imports `src/shared` and `src/generated`.
- A module may import public view contracts from another module only if intentionally documented.

Forbidden:

- Module A importing Module B's internal components/flows/hooks casually.
- `src/shared` importing from `src/modules`.
- API-generated types being redefined manually.
- App routes containing business workflows directly.

## Financial flow state

Every major customer/admin flow should model visible states. Do not collapse backend states into generic success/failure.

For example, buy gold can display:

```text
idle -> quote_loading -> quote_ready -> confirming -> order_created -> balance_locked -> executing -> settlement_pending -> settled
```

Alternative paths:

```text
quote_expired
insufficient_balance
manual_review_required
provider_failed
settlement_failed
unknown_execution_state
```

## Design system

Use a consistent design system:

- shared primitive components in `src/shared/ui`
- module-specific compositions in `src/modules/{module}/components`
- accessible dialogs, forms, tables, alerts, toasts, and confirmation modals
- explicit Persian/RTL and IRR/Toman display policy if the product targets Iran

## Non-goals

Do not build:

- P2P UI
- order book UI
- advanced charting
- multi-provider selection UI
- USDT transfer UI
- advanced tax automation UI

until MVP workflows are validated.
