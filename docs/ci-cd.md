# CI/CD Strategy

## Goals

The frontend CI must prevent:

- type errors
- lint violations
- broken generated API clients
- broken builds
- broken critical workflows
- accidental dependency/security issues

## Recommended CI stages

1. Install dependencies with lockfile enforcement
2. Generate API client from OpenAPI or verify generated client is up to date
3. Lint
4. Type check
5. Unit/component tests
6. Build
7. Playwright E2E tests against mocked or test backend
8. Docker image build if self-hosting
9. Artifact upload: Playwright traces and reports

## Recommended commands

```bash
bun install --frozen-lockfile
bun run generate:api
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
```

## Deployment modes

Choose one and document it:

- Vercel deployment
- Self-hosted Next.js standalone Docker image behind Caddy
- Static export only if the app has no server-runtime requirements

For this financial platform, self-hosted Docker behind Caddy is often a good fit if the backend stack is already self-hosted.
