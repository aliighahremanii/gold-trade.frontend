# MVP API Contract Map

This file is the frontend contract-freeze checklist for MVP workflows.

Use backend OpenAPI as the source of truth.
Do not invent endpoints in this file before the backend contract exists.

## Generation workflow

- Generated client entrypoint: `src/generated/api/index.ts`
- Frontend wrappers: `src/modules/{module}/api`
- Error normalization owner: `src/shared/errors`
- Query invalidation ownership: module-level query key files once OpenAPI is available

## Contract freeze status

| Module | Workflow | OpenAPI source | Status | Notes |
| --- | --- | --- | --- | --- |
| identity | Sign-in, sign-up, verify, session restore | Pending backend OpenAPI | blocked | Confirm cookie/session contract and role claims before wiring route guards to production auth. |
| wallet | Wallet balances and portfolio overview | Pending backend OpenAPI | blocked | Generated balance types must remain backend-owned state in TanStack Query. |
| quote | Quote creation and expiry | Pending backend OpenAPI | blocked | Must preserve expiry, pending, and failure states from backend problem details. |
| trading | Buy, sell, orders | Pending backend OpenAPI | blocked | Confirm idempotency support for quote confirmation and order placement. |
| payments | Deposit and withdrawal | Pending backend OpenAPI | blocked | Capture provider pending and callback-delay states explicitly. |
| delivery | Delivery request and status | Pending backend OpenAPI | blocked | Confirm manual-review, scheduling, and cancellation states. |
| pricing | Admin pricing and market status | Pending backend OpenAPI | blocked | Verify authorization and auditability requirements for manual price changes. |
| admin | Admin approvals dashboard | Pending backend OpenAPI | blocked | Map explicit approval actions to auditable mutation endpoints. |
| audit | Audit log visibility | Pending backend OpenAPI | blocked | Ensure sensitive fields are redacted or access-controlled by backend contract. |
| reconciliation | Reconciliation dashboards | Pending backend OpenAPI | blocked | Preserve mismatch and unknown-state visibility from backend responses. |

## Endpoint checklist template

Use this template for each endpoint once backend OpenAPI is delivered.

| Module | Path | Method | Auth | Access | Request type | Response type | Problem details | Idempotent | Query invalidation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| example | Pending backend OpenAPI | Pending | Pending | Pending | Generated only | Generated only | Pending | Pending | Pending |