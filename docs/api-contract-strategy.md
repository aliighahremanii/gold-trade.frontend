# API Contract Strategy

## Source of truth

Backend OpenAPI documents are the source of truth for frontend API types.

Each backend module exposes or should expose OpenAPI for its route surface. The frontend must generate typed clients rather than hand-writing DTOs.

## Recommended generated client setup

Chosen stack:

- `openapi-typescript` for per-module schema generation from committed OpenAPI snapshots
- `openapi-fetch` for typed HTTP clients in module wrappers
- committed snapshots in `contracts/openapi` refreshed via `pnpm sync:openapi`
- generated output in `src/generated/api/{module}/schema.ts`

Commands:

```bash
pnpm sync:openapi
pnpm generate:api
pnpm check:api-drift
```

Do not mix additional client-generation styles without a documented reason.

## Contract freeze before UI implementation

Before implementing major UI flows, create:

```text
docs/api-contracts/mvp-api-contract-map.md
```

For each endpoint, document:

- module
- path
- method
- auth requirement
- customer/admin access
- request
- response
- problem details/errors
- idempotency behavior
- state transition
- query invalidation rules

## Error handling

Every API wrapper must normalize backend errors into a frontend error model:

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

## Idempotency

Money-moving mutations must pass idempotency keys when supported:

- quote confirmation
- order placement
- payment initiation
- withdrawal request
- delivery request
- admin approval actions

The frontend must prevent accidental double submit with UI guards, but backend idempotency remains the real protection.
