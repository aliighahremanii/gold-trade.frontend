# Self-Hosted Frontend Deployment

This folder contains reference configuration for running the Next.js standalone image behind Caddy.

Canonical build files live at the repository root:

- `Dockerfile` — multi-stage Bun standalone image
- `.github/workflows/frontend-ci.yml` — lint, typecheck, tests, build, E2E
- `.github/workflows/docker-publish.yml` — GHCR image build with BuildKit GHA cache

## Deployment mode

The frontend uses **Next.js `output: "standalone"`** and is intended for **self-hosted Docker behind Caddy** when the backend stack is already self-hosted.

Server routes (auth proxy, session guards, admin layout checks) require a Node/Bun runtime. Static export is not supported.

## Build the image

`NEXT_PUBLIC_*` values are inlined at **image build time**. Server-only `FRONTEND_*` values are read at **container runtime**.

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_ENV=production \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
  -t gold-trade-frontend:latest .
```

Run with runtime session-guard integration:

```bash
docker run --rm -p 3000:3000 \
  -e FRONTEND_SESSION_COOKIE_NAME=gt_session \
  -e FRONTEND_REFRESH_COOKIE_NAME=gt_refresh \
  -e FRONTEND_ADMIN_ROLE_VALUE=admin \
  gold-trade-frontend:latest
```

See `docs/environment.md` for the full variable list.

## Compose + Caddy

1. Copy `docker-compose.frontend.example.yml` and `Caddyfile.example` to your deployment repo or ops folder.
2. Point `NEXT_PUBLIC_API_BASE_URL` build args and runtime `FRONTEND_*` values at your production gateway.
3. Attach the frontend service and Caddy to a shared external Docker network that can reach the backend API.
4. Terminate TLS in Caddy and forward `X-Forwarded-Proto` / `X-Forwarded-Host` to the Next.js server.

`Caddyfile.example` adds HSTS at the edge. The app still ships its own CSP and baseline security headers from `next.config.ts`.

## CI artifacts

`frontend-ci` uploads on every run:

- `playwright-report-<run_id>` — HTML report (`playwright-report/`)
- `playwright-traces-<run_id>` — traces and screenshots on failure (`test-results/`)

Download artifacts from the GitHub Actions run summary when debugging flaky workflow specs.

## Local parity

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build
CI=true bun run test:e2e
```

`CI=true` makes Playwright use `next start` (production server) instead of `next dev`, matching the CI job.
