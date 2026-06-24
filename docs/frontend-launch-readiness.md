# Frontend Launch Readiness Report

**Date:** 2026-06-24  
**Scope:** Final MVP review — XAU/IRR customer and admin workflows  
**Reviewer:** Automated final MVP review (prompt `docs/prompts/90-final-frontend-mvp-review.md`)

## Executive summary

The frontend implements the full MVP route map with thin App Router pages, module-owned flows, generated OpenAPI clients for all 16 backend modules, and strong unit-test coverage for architecture boundaries, financial failure UX, and security helpers.

**Verdict: No-Go** for production launch until CI E2E workflow suites are green again and backend-real smoke validation is executed against staging.

| Gate | Status |
| --- | --- |
| `bun run lint` | Pass |
| `bun run typecheck` | Pass |
| `bun run test` (160 unit tests) | Pass |
| `bun run build` | Pass |
| `bun run check:api-drift` | Pass (after regenerate) |
| `bun run test:e2e` | **Fail** — 15/19 workflow tests failing in CI since 2026-06-24 |
| Backend-real E2E (`E2E_MODE=backend-real`) | Not run in this review |
| GitHub Actions `frontend-ci` on `main` | **Fail** (last 2 runs) |

---

## Customer flows verified (code + unit tests)

All customer routes compose module flows; pages contain no business logic.

| Route | Flow | MVP workflow |
| --- | --- | --- |
| `/sign-in`, `/sign-up`, `/verify`, `/access-denied` | Identity flows | Auth + OTP/TOTP verification |
| `/dashboard` | `CustomerDashboardShellFlow` | Portfolio overview |
| `/wallet` | `WalletShellFlow` | Balances (backend-owned TanStack Query) |
| `/trade/buy`, `/trade/sell` | `BuyGoldShellFlow`, `SellGoldShellFlow` | Quote → confirm → order status |
| `/orders` | `OrdersShellFlow` | Order history |
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

**Indirect coverage:** `src/test/*.test.ts` (8 files, 160 tests total) exercises scaffold composition, API contract manifest, customer/admin shells, failure-state UX, security helpers, and admin operational mappers. This substitutes for formal review artifacts but does not satisfy the “separate reviewer per phase” process documented in `docs/review/README.md`.

---

## Validation results (this review)

```text
bun run lint         → exit 0
bun run typecheck    → exit 0
bun run test         → 160 passed (35 files)
bun run build        → exit 0 (28 routes)
bun run check:api-drift → exit 0 (after regenerate)
bun run test:e2e     → exit 1
  smoke:  4/4 pass (on committed HEAD at CI)
  workflows: 0/15 pass (CI, since commit 1aa2eae)
```

### E2E failure analysis

**Symptom:** All workflow tests fail at `signIn()` — page remains on `/sign-in` after submit.

**Regression introduced:** Commit `1aa2eae` (2026-06-24) added production security headers via `next.config.ts` `headers()`. CI E2E was green on `983288b` immediately before.

**Root causes:**

1. **Production CSP baked at build** — With `NODE_ENV=production` during `next start`, production CSP `connect-src` only allows `'self'` and the build-time `NEXT_PUBLIC_API_BASE_URL` (`https://saba.gold`). Playwright mock API runs at `http://127.0.0.1:3099`.
2. **Secure cookies over HTTP** — `secure: true` session cookies under `next start` are not persisted on `http://127.0.0.1:3001`, so layout guards redirect back to sign-in even when auth API succeeds.
3. **Server-side API URL** — Auth route handler (`src/app/api/auth/sign-in/route.ts`) proxies to `getModuleBaseUrl("identity")`. Before a server-side `OPENAPI_BASE_URL` override, the baked `NEXT_PUBLIC_*` value pointed at staging during CI E2E.
4. **`next start` + `output: standalone`** — Next.js warns that `next start` is incompatible with standalone output; CI and local E2E use `next start` today.

**Partial fix in working tree (uncommitted):**

- `src/shared/api/config.ts` — prefer `OPENAPI_BASE_URL` on server
- `src/shared/auth/session-cookie.ts` — `FRONTEND_INSECURE_COOKIES` override
- `src/shared/config/security-headers.ts` — `FRONTEND_SECURITY_PROFILE=development` override
- `playwright.config.ts` — E2E server env overrides
- `src/proxy.ts` — move security headers to runtime proxy (respects overrides)

These changes must be committed, validated end-to-end, and CI must be green before launch.

---

## Blockers

| # | Severity | Blocker | Recommended fix |
| --- | --- | --- | --- |
| B1 | **Critical** | CI E2E workflow suite failing (15 tests) | Land E2E compatibility fixes; verify `frontend-ci` green |
| B2 | **Critical** | No backend-real E2E run against staging | Run `E2E_MODE=backend-real` with staging credentials before launch |
| B3 | **High** | Phase review artifacts missing (01–50) | Run review prompts with separate reviewer agent or accept risk with documented unit/E2E coverage |
| B4 | **Medium** | `next start` vs standalone output mismatch | Update Playwright/CI to use `node .next/standalone/server.js` or document dev-mode E2E for CI |

---

## Risks (non-blocking but tracked)

| Risk | Impact | Mitigation |
| --- | --- | --- |
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
| E2E in CI | **Failing** |
| Docker standalone image | `Dockerfile` + `ci-cd/` examples present |
| Security headers | Implemented (proxy or next.config) |
| Playwright artifacts on failure | Configured (14-day retention) |
| Bun version pinned | `1.3.14` |

---

## Go / No-Go recommendation

### **No-Go**

The frontend codebase is structurally ready for MVP: routes, flows, contracts, and unit tests align with `AGENTS.md` and `docs/architecture.md`. However, **CI is red on E2E workflow tests** since the security-headers change, and **backend-real validation has not been executed** in this review cycle.

### Conditions for Go

1. Commit and verify E2E compatibility fixes (API base URL, cookie security profile, CSP override for E2E).
2. `frontend-ci` green on `main` including all 19 Playwright tests.
3. Backend-real smoke suite passes against staging (`test/e2e/backend-real/customer-smoke.spec.ts`).
4. Stakeholder sign-off on missing phase review artifacts or completion of outstanding review prompts.

---

## Files changed in this review

| File | Action |
| --- | --- |
| `docs/frontend-launch-readiness.md` | **Created** (this report) |

No application code was committed during this review. Uncommitted working-tree fixes exist for E2E regression (see E2E failure analysis).

---

## Assumptions and missing backend contracts

- Staging API (`https://saba.gold`) is available for contract sync and backend-real E2E.
- Mock API (`test/e2e/mock-api/server.mjs`) accurately simulates MVP state transitions for CI workflow tests.
- Backend enforces authorization; frontend guards are UX boundaries only.
- `ProblemFieldError` / `ProblemResponse` patches in `contracts/openapi/problem-schema-compatibility.json` remain valid until backend OpenAPI includes those schemas.
- Physical delivery, manual review, and reconciliation states match backend enum values consumed by mappers.
