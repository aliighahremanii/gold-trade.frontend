# Frontend Security and Financial Safety

## Authentication

Use backend-approved authentication/session handling.

Preferred:

- HttpOnly secure cookies or BFF/session pattern where possible
- server-side validation for protected route groups
- explicit admin route protection

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

Server-only secrets must never be referenced from client components.

## Security headers

Deployment should include:

- Content-Security-Policy
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security in HTTPS production
