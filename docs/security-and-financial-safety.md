# Frontend Security and Financial Safety

## Authentication

Use backend-approved authentication/session handling.

Preferred:

- HttpOnly secure cookies or BFF/session pattern where possible
- server-side validation for protected route groups
- explicit admin route protection
- preserve the original destination when redirecting users to sign-in

Avoid:

- `localStorage` token storage
- exposing tokens in logs
- relying on hidden UI for authorization

## Financial safety rules

- Disable double-submit while a mutation is in progress.
- Use idempotency keys for money-moving actions when supported.
- Do not show optimistic final success for financial operations.
- Show pending and manual-review states clearly.
- Refetch critical state after mutations.
- Make dangerous admin actions explicit and auditable.

## Sensitive data

Do not log:

- tokens
- OTPs
- payment secrets
- full personal identifiers unless required
- raw bank data
- provider secrets

## Environment variables

Only values safe for the browser may use `NEXT_PUBLIC_*`.

Server-only secrets and guard configuration must never be referenced from client components.

Documented variables:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | Browser | Environment label for non-secret client behavior |
| `NEXT_PUBLIC_API_BASE_URL` | Browser | Public API gateway base URL |
| `OPENAPI_BASE_URL` | Server/build | OpenAPI snapshot and codegen source |
| `FRONTEND_SIGN_IN_PATH` | Server | Sign-in redirect path |
| `FRONTEND_SESSION_COOKIE_NAME` | Server | Session cookie name for proxy/guards |
| `FRONTEND_REFRESH_COOKIE_NAME` | Server | Refresh cookie name for silent renewal |
| `FRONTEND_DEVICE_ID_COOKIE_NAME` | Server | Device binding cookie name |
| `FRONTEND_DEVICE_NAME_COOKIE_NAME` | Server | Device label cookie name |
| `FRONTEND_ADMIN_ROLE_VALUE` | Server | Backend-validated admin role slug |

Never place tokens, provider credentials, payment secrets, or signing keys in `NEXT_PUBLIC_*`.

## Security headers

Deployment should include:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security in HTTPS production

The Next.js app applies environment-aware response headers from `src/shared/config/security-headers.ts` via `next.config.ts`.

Production builds use a hardened CSP (`script-src 'self'`, trusted `connect-src` only). Local development keeps broader allowances for Next.js HMR and localhost API targets.

For self-hosted production behind Caddy or another reverse proxy, also terminate TLS at the edge and forward `X-Forwarded-Proto`. Add `Strict-Transport-Security` at the proxy when HTTPS is guaranteed.

## Observability and error reporting

- Use `src/shared/observability/safe-logger.ts` for operational logs in non-production environments.
- Use `reportApiError` for API failures; it logs sanitized metadata only.
- Never log tokens, OTPs, payment secrets, raw bank data, or provider credentials.
- Correlation and request IDs are forwarded by the API proxy (`x-correlation-id`, `x-request-id`) and surfaced to operators through `operationReference` on normalized API errors when response headers are available.
- Reconciliation and audit admin views already expose backend-owned correlation and business references; do not invent client-side trace identifiers for financial records.
