# MVP API Contract Map

This file is the frontend contract-freeze checklist for MVP workflows.

Use backend OpenAPI as the source of truth.
Do not invent endpoints in this file before the backend contract exists.

## Generation workflow

- Staging OpenAPI source: `https://saba.gold/api/{module}/v1/openapi.json`
- Contract snapshots: `contracts/openapi/{module}.openapi.json`
- Temporary snapshot compatibility allowlist: `contracts/openapi/problem-schema-compatibility.json`
- Generated client entrypoint: `src/generated/api/index.ts`
- Per-module generated types: `src/generated/api/{module}/schema.ts`
- Frontend wrappers: `src/modules/{module}/api`
- Shared HTTP client: `src/shared/api`
- Error normalization owner: `src/shared/errors`
- Query invalidation ownership: `src/modules/{module}/api/query-keys.ts`

Refresh commands:

```bash
bun run sync:openapi
bun run generate:api
bun run check:api-drift
```

## Contract freeze status

| Module | Workflow | OpenAPI source | Status | Notes |
| --- | --- | --- | --- | --- |
| identity | Sign-in, sign-up, verify, session restore | `contracts/openapi/identity.openapi.json` | frozen | Cookie/session transport still needs frontend auth wiring; role claims come from `/me`. |
| assets | Market metadata and capability labels | `contracts/openapi/asset.openapi.json` | frozen | Frontend module name is `assets`; backend module is `asset`. |
| wallet | Wallet balances and portfolio overview | `contracts/openapi/wallet.openapi.json` | frozen | Customer reads use `/wallet/me/*`; balances remain backend-owned TanStack Query state. |
| quote | Quote creation and expiry | `contracts/openapi/quote.openapi.json` | frozen | Preserve expiry and confirmation-eligibility states from generated schemas and problem details. |
| trading | Buy, sell, orders | `contracts/openapi/trading.openapi.json` | frozen | Confirm idempotency headers during mutation wrapper implementation. |
| settlement | Settlement status visibility | `contracts/openapi/settlement.openapi.json` | frozen | Settlement retry and failure states must remain visible in trading flows. |
| payments | Deposit and withdrawal | `contracts/openapi/payments.openapi.json` | frozen | Provider callback and pending states are part of the contract. |
| delivery | Delivery request and status | `contracts/openapi/delivery.openapi.json` | frozen | Manual review, scheduling, and cancellation states are documented in OpenAPI. |
| pricing | Admin pricing and market status | `contracts/openapi/pricing.openapi.json` | frozen | Admin mutations also exist under the `admin` module prefix. |
| admin | Admin approvals dashboard | `contracts/openapi/admin.openapi.json` | frozen | Cross-module admin actions are namespaced under `/admin/*`. |
| audit | Audit log visibility | `contracts/openapi/audit.openapi.json` | frozen | Sensitive fields must stay backend-redacted. |
| compliance | Manual review and limits | `contracts/openapi/compliance.openapi.json` | frozen | Review-case states must not be collapsed in UI. |
| reconciliation | Reconciliation dashboards | `contracts/openapi/reconciliation.openapi.json` | frozen | Mismatch and unknown-state visibility is required. |
| ledger | Admin ledger visibility | `contracts/openapi/ledger.openapi.json` | frozen | Admin-only surface; not part of customer MVP navigation yet. |
| notification | Notification delivery status | `contracts/openapi/notification.openapi.json` | frozen | Contract synced from staging; UI module not scaffolded yet. |
| liquidity | Liquidity execution visibility | `contracts/openapi/liquidity.openapi.json` | frozen | Contract synced from staging; admin visibility only for MVP. |

## MVP endpoint inventory

Paths below are module-relative. Full URL shape: `{NEXT_PUBLIC_API_BASE_URL}/api/{module}/v1{path}`.

### Identity

| Path | Method | MVP use |
| --- | --- | --- |
| `/auth/sign-up` | POST | Registration |
| `/auth/sign-in` | POST | Sign-in |
| `/auth/refresh` | POST | Session refresh |
| `/auth/sign-out` | POST | Sign-out |
| `/me` | GET | Session restore and role claims |
| `/verification/otp/send` | POST | Verification challenge |
| `/verification/otp/verify` | POST | Verification confirm |

### Wallet

| Path | Method | MVP use |
| --- | --- | --- |
| `/wallet/me/accounts` | GET | Customer wallet list |
| `/wallet/me/accounts/{id}` | GET | Account detail |
| `/wallet/me/accounts/{id}/balance` | GET | Balance read |

### Quote

| Path | Method | MVP use |
| --- | --- | --- |
| `/quotes` | POST | Create quote |
| `/quotes/{id}` | GET | Quote detail and expiry |
| `/quotes/{id}/confirmation-eligibility` | GET | Confirm readiness |
| `/quote/quotes/{id}/consume` | POST | Consume quote into downstream workflow |

### Trading

| Path | Method | MVP use |
| --- | --- | --- |
| `/orders` | GET, POST | Order history and placement |
| `/orders/{id}` | GET | Order status |
| `/orders/{id}/cancel` | POST | Cancel when backend allows |

### Payments

| Path | Method | MVP use |
| --- | --- | --- |
| `/payments/deposits` | GET, POST | Deposit initiation and status |
| `/payments/deposits/{id}` | GET | Deposit detail |
| `/payments/withdrawals` | GET, POST | Withdrawal initiation and status |
| `/payments/withdrawals/{id}` | GET | Withdrawal detail |

### Delivery

| Path | Method | MVP use |
| --- | --- | --- |
| `/delivery/requests` | GET, POST | Request list and create |
| `/delivery/requests/{id}` | GET | Request detail |
| `/delivery/zones` | GET | Supported delivery zones |

### Pricing and admin operations

| Path | Module | Method | MVP use |
| --- | --- | --- | --- |
| `/pricing/markets/{symbol}/selected` | pricing | GET | Customer price display |
| `/pricing/markets/{symbol}/status` | pricing | GET | Market open/closed state |
| `/admin/pricing/markets/{symbol}/manual-prices` | admin | POST | Manual price update |
| `/admin/pricing/markets/{symbol}/status` | admin | POST | Market status change |
| `/admin/trading/orders/{id}/approve` | admin | POST | Order approval |
| `/admin/payments/withdrawals/{id}/approve` | admin | POST | Withdrawal approval |
| `/admin/delivery/requests/{id}/approve` | admin | POST | Delivery approval |

### Audit and reconciliation

| Path | Method | MVP use |
| --- | --- | --- |
| `/audit/records` | GET | Audit search |
| `/audit/records/{id}` | GET | Audit detail |
| `/reconciliation/runs/wallet-ledger` | POST | Start wallet-ledger run |
| `/reconciliation/mismatches` | GET | Mismatch list |
| `/reconciliation/mismatches/{id}` | GET | Mismatch detail |

## Problem details

Generated schemas include shared `ProblemResponse` and `ProblemFieldError` components.
Frontend normalization maps them in `src/shared/errors/normalize-api-error.ts` to:

- validation error
- authentication error
- authorization error
- not found
- conflict
- quote expired
- insufficient balance
- manual review required
- provider unavailable
- settlement failed
- payment pending/failed
- unknown error

## Endpoint checklist template

Use this template for each new endpoint during implementation.

| Module | Path | Method | Auth | Access | Request type | Response type | Problem details | Idempotent | Query invalidation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| example | `/orders` | POST | bearer/session | customer | Generated only | Generated only | `ProblemResponse` | confirm in wrapper | `tradingQueryKeys.orders()` |

## Open assumptions

- Staging API base URL is `https://saba.gold`; frontend development and contract sync use staging by default.
- Default backend path prefix is `/api/{module}/v1`.
- Browser auth transport for MVP still needs explicit frontend implementation; OpenAPI documents bearer auth schemes.
- Idempotency header names must be confirmed per mutation when wrappers are implemented.
- `asset`, `settlement`, `compliance`, and `ledger` contracts are frozen for upcoming flows even when current scaffold pages do not call them yet.
- Some backend module OpenAPI exports reference shared `ProblemResponse` schemas without embedding `ProblemFieldError` or `ProblemResponse` component definitions. `scripts/patch-openapi-document.mjs` injects the shared building-block shape at generation time until backend exports are fully self-contained.
- Every temporary schema repair must be declared in `contracts/openapi/problem-schema-compatibility.json`; undocumented or stale compatibility patches fail generation.
