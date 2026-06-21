# Environment Variables

Document actual variables in the frontend repository.

## Staging API (default for frontend development)

The frontend team uses the shared staging API for contract sync and integration testing:

```text
https://saba.gold/api/{module}/v1
```

OpenAPI documents:

```text
https://saba.gold/api/{module}/v1/openapi.json
```

Examples:

- https://saba.gold/api/identity/v1/openapi.json
- https://saba.gold/api/wallet/v1/openapi.json

Staging is non-production and safe for frontend development.

## Recommended `.env` pattern

```env
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_API_BASE_URL=https://saba.gold
OPENAPI_BASE_URL=https://saba.gold
FRONTEND_SIGN_IN_PATH=/sign-in
FRONTEND_SESSION_COOKIE_NAME=gt_session
FRONTEND_ADMIN_ROLE_COOKIE_NAME=gt_role
FRONTEND_ADMIN_ROLE_VALUE=admin
```

For local backend development only, override `NEXT_PUBLIC_API_BASE_URL` and `OPENAPI_BASE_URL` to your local gateway.

## Rules

- Only browser-safe values can be prefixed with `NEXT_PUBLIC_`.
- Keep session and role guard variables server-only.
- Never expose secrets, provider credentials, payment credentials, or server tokens.
- Keep `.env.example` updated.

Server-side route protection uses the `FRONTEND_*` values above to read backend-managed session and role cookies in App Router layouts.
These values are integration points, not a replacement for backend authorization rules.

## Package manager

Use Bun for install, scripts, and CI:

```bash
bun install
bun run dev
bun run generate:api
```
