# Frontend Launch Readiness Report

**Date:** 2026-06-24  
**Scope:** Final MVP review — XAU/IRR customer and admin workflows  
**Reviewer:** Automated final MVP review (prompt `docs/prompts/90-final-frontend-mvp-review.md`)

## Executive summary

The frontend implements the full MVP route map with thin App Router pages, module-owned flows, generated OpenAPI clients for all 16 backend modules, and strong unit-test coverage for architecture boundaries, financial failure UX, and security helpers.

**Verdict: Conditional No-Go** — CI is green and all mock-API E2E workflows pass, but backend-real staging smoke and formal phase review artifacts remain outstanding before production launch.

| Gate | Status |
| --- | --- |
| `bun run lint` | Pass |
| `bun run typecheck` | Pass |
| `bun run test` (164 unit tests) | Pass |
| `bun run build` | Pass (28 routes) |
| `bun run check:api-drift` | Pass |
| `bun run test:e2e` | **Pass** — 19/19 (4 smoke + 15 workflows) |
| Backend-real E2E (`E2E_MODE=backend-real`) | Not run in this review |
| GitHub Actions `frontend-ci` on `main` | **Pass** (commit `637e311`, 2026-06-24) |

---

## Customer flows verified (code + unit tests)

All customer routes compose module flows; pages contain no business logic.

| Route | Flow | MVP workflow |
| --- | --- | --- |
| `/sign-in`, `/sign-up`, `/verify`, `/access-denied` | Identity flows | Auth + OTP/TOTP verification |
| `/dashboard` | `CustomerDashboardShellFlow` | Quick links only (scaffold; live balances on `/wallet`) |
| `/wallet` | `WalletShellFlow` | Balances (backend-owned TanStack Query) |
| `/trade/buy`, `/trade/sell` | `BuyGoldShellFlow`, `SellGoldShellFlow` | Quote → confirm → order status |
| `/orders` | `OrdersShellFlow` | **Scaffold** — no list endpoint in trading OpenAPI |
| `/payments/deposit` | `DepositIrrShellFlow` | IRR deposit |
| `/payments/withdraw`, `/payments/withdraw/[id]` | `WithdrawIrrShellFlow`, `WithdrawIrrDetailFlow` | IRR withdrawal + detail |
| `/delivery/request`, `/delivery/[id]` | `RequestDeliveryShellFlow`, `DeliveryDetailShellFlow` | Physical delivery |

**Auth guard:** `src/app/(customer)/layout.tsx` → `requireVerifiedCustomerSession()` (session + mobile verification).

---

## Admin flows verified (code + unit tests)

| Route | Flow | MVP workflow |
| --- | --- | --- |
| `/admin/dashboard` | `AdminDashboardShellFlow` | Operations hub |
| `/admin/pricing` | `AdminPricingFlow` | Manual XAU/IRR pricing |
| `/admin/market-status` | `AdminMarketStatusFlow` | Market open/manual-only |
| `/admin/orders`, `/admin/orders/[id]` | `AdminOrdersFlow`, `AdminOrderDetailFlow` | Order review + liquidity panel |
| `/admin/approvals` | `AdminApprovalsFlow` | Compliance review cases |
| `/admin/payments` | `AdminPaymentsFlow` | Withdrawal approvals |
| `/admin/delivery` | `AdminDeliveryFlow` | Delivery approvals |
| `/admin/ledger` | `AdminLedgerFlow` | Ledger postings |
| `/admin/audit` | `AdminAuditFlow` | Audit records |
| `/admin/reconciliation` | `AdminReconciliationFlow` | Runs + mismatches |

**Auth guard:** `src/app/(admin)/layout.tsx` → `requireAdminSession()` with backend `/me` role check.

---

## Architecture compliance

| Rule | Status | Notes |
| --- | --- | --- |
| Thin `src/app` pages | Pass | All pages delegate to `src/modules/{module}/flows` |
| Generated API types | Pass | 16 modules under `src/generated/api/` |
| TanStack Query for server state | Pass | Module-owned hooks + query keys |
| No financial state in Zustand/Redux | Pass | No global client stores for balances/orders |
| No optimistic balance mutation | Pass | Covered by `failure-state-ux.test.ts` |
| Failure/pending states visible | Pass | Unit tests for trade, payments, delivery, orders |
| Admin route protection | Pass | Server-side layout guards + proxy allowlist |
| No secrets in `NEXT_PUBLIC_*` | Pass | Session cookie names are server-only |

---

## API contracts used

All modules are frozen per `docs/api-contracts/mvp-api-contract-map.md`:

`identity`, `asset`, `wallet`, `quote`, `trading`, `settlement`, `payments`, `delivery`, `pricing`, `admin`, `audit`, `compliance`, `reconciliation`, `ledger`, `notification`, `liquidity`

**Modules without dedicated UI (acceptable for MVP):**

| Module | Status |
| --- | --- |
| `notification` | Contract synced; no `src/modules/notification/` |
| `assets` | Scaffold only (`query-keys.ts`); metadata via wallet/trading |
| `settlement` | `useSettlement` hook exists but unused; status shown via order/payment fields |
| `liquidity` | Embedded in admin order detail (`ProviderExecutionPanel`) |
| `quote` | Consumed inside trading buy/sell workflow only |

**Compatibility patches:** 10 modules require `ProblemFieldError` / `ProblemResponse` patches (documented in `src/generated/api/manifest.json`).

---

## Review prompts status

| Review area | Prompt | Completed review artifact |
| --- | --- | --- |
| Scaffold | `00-scaffold-review.md` | `docs/review/scaffold-stage-review.md` — **Approved** |
| API contract | `01-api-contract-review.md` | Not found |
| Shared UI | `03-shared-ui-review.md` | Not found |
| Customer shell | `10-customer-app-shell-review.md` | Not found |
| Identity/auth | `11-identity-auth-flow-review.md` | Not found |
| Wallet/dashboard | `12-wallet-dashboard-review.md` | Not found |
| Buy/sell gold | `13-buy-sell-gold-flow-review.md` | Not found |
| Payments | `14-payments-flow-review.md` | Not found |
| Delivery | `15-delivery-flow-review.md` | Not found |
| Admin shell | `20-admin-app-shell-review.md` | Not found |
| Admin pricing/market | `21-admin-pricing-market-status-review.md` | Not found |
| Admin orders/approvals | `22-admin-orders-approvals-review.md` | Not found |
| Admin payments/delivery | `23-admin-payments-delivery-review.md` | Not found |
| Admin ledger/audit/recon | `24-admin-ledger-audit-reconciliation-review.md` | Not found |
| E2E workflows | `30-e2e-workflows-review.md` | Not found |
| Failure-state UX | `31-failure-state-ux-review.md` | Not found |
| Security/observability | `40-security-observability-review.md` | Not found |
| CI/CD production | `50-ci-cd-production-review.md` | Not found |

**Indirect coverage:** 36 unit test files (164 tests) including `src/test/scaffold.test.ts`, `customer-shell.test.ts`, `admin-shell.test.ts`, `failure-state-ux.test.ts`, `security-observability.test.ts`, `api-contract.test.ts`, and module workflow tests. 10 Playwright E2E specs cover smoke, customer trade/payments/delivery, admin pricing/audit/reconciliation, and failure states.

---

## Validation results (this review)

```text
bun run lint            → exit 0
bun run typecheck       → exit 0
bun run test            → 164 passed (36 files)
bun run build           → exit 0 (28 routes)
bun run check:api-drift → exit 0
bun run test:e2e (CI=1) → exit 0
  smoke:     4/4 pass
  workflows: 15/15 pass
```

### E2E regression (resolved)

Commit `1aa2eae` introduced production security headers that broke CI E2E (CSP blocked mock API, secure cookies failed over HTTP, server-side API URL pointed at staging). Commit `637e311` resolved this by:

- Moving CSP to runtime proxy (`src/proxy.ts`) with `FRONTEND_SECURITY_PROFILE=development` override for E2E
- Adding `FRONTEND_INSECURE_COOKIES=true` for HTTP-based Playwright runs
- Preferring `OPENAPI_BASE_URL` on the server (`src/shared/api/config.ts`)
- Setting mock-API and cookie overrides in `playwright.config.ts`

**Remaining E2E note:** CI still uses `next start` with `output: standalone`, which Next.js warns is incompatible. Tests pass today; consider switching CI to `node .next/standalone/server.js` for production parity.

---

## Blockers

| # | Severity | Blocker | Recommended fix |
| --- | --- | --- | --- |
| B1 | **Critical** | No backend-real E2E run against staging | Run `E2E_MODE=backend-real` with staging customer credentials before launch |
| B2 | **High** | Phase review artifacts missing (01–50) | Run review prompts with separate reviewer agent or accept risk with documented unit/E2E coverage |
| B3 | **Medium** | Customer `/orders` page is scaffold | Add backend list-orders endpoint or accept MVP without order history |
| B4 | **Low** | `next start` vs standalone output mismatch | Update Playwright/CI to use `node .next/standalone/server.js` for production parity |

---

## Risks (non-blocking but tracked)

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `/orders` scaffold | No customer order history UI | Backend trading OpenAPI has no list-orders GET; only `POST /orders` and `GET /orders/{id}` |
| `notification` module has no UI | Users cannot see notification delivery status | Accept for MVP; add post-launch if ops requires it |
| `settlement` hook unused | Settlement detail only via order/payment status fields | Confirm backend surfaces sufficient status in trading/payments responses |
| `assets` module scaffold-only | No dedicated asset metadata page | Wallet/trading displays use wallet/pricing APIs |
| OpenAPI compatibility patches | 10 modules patch missing problem schemas | Monitor contract drift; regenerate when backend fixes schemas |
| `localStorage` for device ID | Identity `getDeviceId()` uses `localStorage` | Documented integration choice; not auth token storage |
| Backend-real not validated | Staging integration gaps undetected | Protected CI job or manual pre-launch checklist |

---

## CI/CD readiness

| Item | Status |
| --- | --- |
| `frontend-ci.yml` — lint, typecheck, test, build, api-drift | Configured |
| E2E in CI | **Passing** (19 tests, commit `637e311`) |
| Docker standalone image | `Dockerfile` + `ci-cd/` examples present |
| Security headers | Implemented (proxy or next.config) |
| Playwright artifacts on failure | Configured (14-day retention) |
| Bun version pinned | `1.3.14` |

---

## Go / No-Go recommendation

### **Conditional No-Go**

The frontend codebase is structurally ready for MVP: all required routes exist, money-moving flows are implemented with explicit backend-owned states, generated API clients cover 16 modules, and **CI is green** including all 19 Playwright workflow tests.

Launch is blocked only by **unvalidated staging integration** (backend-real smoke) and **missing formal phase review artifacts** (prompts 01–50). Product gaps (`/orders` scaffold, thin `/dashboard`) are acceptable for MVP if stakeholders agree.

### Conditions for Go

1. Backend-real smoke suite passes against staging (`test/e2e/backend-real/customer-smoke.spec.ts`).
2. Stakeholder sign-off on missing phase review artifacts or completion of outstanding review prompts.
3. Ops acceptance of `/orders` scaffold until backend exposes a customer order-list endpoint.

---

## Files changed in this review

| File | Action |
| --- | --- |
| `docs/frontend-launch-readiness.md` | **Updated** (this report) |

No application code was changed during this review pass. E2E fixes were already committed in `637e311`.

---

## Assumptions and missing backend contracts

- Staging API (`https://saba.gold`) is available for contract sync and backend-real E2E.
- Mock API (`test/e2e/mock-api/server.mjs`) accurately simulates MVP state transitions for CI workflow tests.
- Backend enforces authorization; frontend guards are UX boundaries only.
- `ProblemFieldError` / `ProblemResponse` patches in `contracts/openapi/problem-schema-compatibility.json` remain valid until backend OpenAPI includes those schemas.
- Trading OpenAPI has no customer order-list endpoint; `/orders` remains a scaffold until backend adds one.
- Physical delivery, manual review, and reconciliation states match backend enum values consumed by mappers.
