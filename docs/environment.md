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
FRONTEND_REFRESH_COOKIE_NAME=gt_refresh
FRONTEND_DEVICE_ID_COOKIE_NAME=gt_device_id
FRONTEND_DEVICE_NAME_COOKIE_NAME=gt_device_name
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

## Production / Docker

| Variable | When set | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | Image **build** | `production` for release images |
| `NEXT_PUBLIC_API_BASE_URL` | Image **build** | Public API gateway origin (no trailing slash). Inlined into client bundles and production CSP `connect-src`. |
| `FRONTEND_SIGN_IN_PATH` | Container **runtime** | Sign-in redirect path |
| `FRONTEND_SESSION_COOKIE_NAME` | Container **runtime** | Backend session cookie name |
| `FRONTEND_REFRESH_COOKIE_NAME` | Container **runtime** | Backend refresh cookie name |
| `FRONTEND_DEVICE_ID_COOKIE_NAME` | Container **runtime** | Device id cookie name |
| `FRONTEND_DEVICE_NAME_COOKIE_NAME` | Container **runtime** | Device name cookie name |
| `FRONTEND_ADMIN_ROLE_VALUE` | Container **runtime** | Role string validated via backend `/me` |

Example production image build:

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_ENV=production \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -t gold-trade-frontend:latest .
```

`OPENAPI_BASE_URL` is only required on developer machines and in CI for optional live contract sync; it is not needed in the production runtime container.

GitHub Actions can set `PRODUCTION_API_BASE_URL` as a repository variable for `docker-publish` builds. See `docs/ci-cd.md` and `ci-cd/README.md`.

## Package manager

Use Bun for install, scripts, and CI:

```bash
bun install
bun run dev
bun run generate:api
```
