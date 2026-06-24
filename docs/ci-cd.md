# CI/CD Strategy

## Goals

The frontend CI must prevent:

- type errors
- lint violations
- broken generated API clients
- broken builds
- broken critical workflows
- accidental dependency/security issues

## Workflows

| Workflow | File | Purpose |
| --- | --- | --- |
| `frontend-ci` | `.github/workflows/frontend-ci.yml` | PR/push validation on `main` and `dev` |
| `Build and Publish Container` | `.github/workflows/docker-publish.yml` | GHCR image build on `main`, tags, and PRs |

Operational deployment examples live in `ci-cd/README.md`.

## CI stages

`frontend-ci` runs in order:

1. Install dependencies with lockfile enforcement (`bun install --frozen-lockfile`)
2. Generate API client from committed OpenAPI snapshots
3. Fail on generated client drift (`bun run check:api-drift`)
4. Lint
5. Type check
6. Unit/component tests
7. Production build (`bun run build`)
8. Verify standalone output (`.next/standalone/server.js`)
9. Playwright E2E tests against the local mock API
10. Upload Playwright HTML report and failure traces

## Build cache

`frontend-ci` caches:

- Bun install (`~/.bun/install/cache`, `node_modules`) keyed on `bun.lock`
- Next.js compiler cache (`.next/cache`) keyed on lockfile, config, and `src/**`

`docker-publish` uses GitHub Actions BuildKit cache (`cache-from` / `cache-to: type=gha`).

## CI environment

The workflow sets staging-safe public values for build and E2E:

```env
CI=true
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_API_BASE_URL=https://saba.gold
OPENAPI_BASE_URL=https://saba.gold
```

`CI=true` makes Playwright start the production server (`next start`) instead of `next dev`.

## E2E artifacts

Every run uploads:

- `playwright-report-<run_id>` — HTML report
- `playwright-traces-<run_id>` — failure traces/screenshots (`test-results/`), when E2E fails

## Recommended local commands

```bash
bun install --frozen-lockfile
bun run generate:api
bun run lint
bun run typecheck
bun run test
bun run build
CI=true bun run test:e2e
```

## Deployment mode

**Self-hosted Next.js standalone Docker behind Caddy** is the documented production path.

- Root `Dockerfile` emits a Bun distroless standalone image (`output: "standalone"` in `next.config.ts`).
- `ci-cd/Caddyfile.example` terminates TLS, adds HSTS, and reverse-proxies to the frontend container.
- `ci-cd/docker-compose.frontend.example.yml` wires frontend + Caddy on a shared network.

Vercel or static export are not used for this app because server routes handle auth proxying and session guards.

## Production security notes

- Apply TLS at the reverse proxy and enable `Strict-Transport-Security` for HTTPS-only deployments.
- Keep session, refresh, and device cookies `HttpOnly` and `Secure` in production.
- Restrict admin routes with server-side `requireAdminSession`; UI hiding is not authorization.
- Review `docs/security-and-financial-safety.md` before changing env vars, proxy behavior, or response headers.
- Baseline browser security headers ship from `next.config.ts`; production CSP omits `unsafe-inline`/`unsafe-eval` for scripts and limits `connect-src` to `'self'` plus `NEXT_PUBLIC_API_BASE_URL`.
- Pass `NEXT_PUBLIC_*` values as Docker **build args**; pass `FRONTEND_*` session-guard values at **container runtime** (see `docs/environment.md`).

## Container publishing

`docker-publish` pushes to `ghcr.io/<repository>` on `main` and version tags. Set the repository variable `PRODUCTION_API_BASE_URL` to bake the production API origin into published images, or rebuild locally with `--build-arg NEXT_PUBLIC_API_BASE_URL=...` for environment-specific deploys.
