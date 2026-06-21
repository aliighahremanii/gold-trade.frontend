# OpenAPI contract snapshots

These JSON files are the frontend contract-freeze source of truth for generated API types.

## Staging API source

The frontend team syncs contracts from the shared staging API:

```text
https://saba.gold/api/{module}/v1/openapi.json
```

Examples:

- https://saba.gold/api/identity/v1/openapi.json
- https://saba.gold/api/wallet/v1/openapi.json

Staging is safe for frontend development: use it to generate types and call APIs without production risk.

## Refresh workflow

```bash
bun run sync:openapi
bun run generate:api
bun run check:api-drift
```

`sync:openapi` defaults to `https://saba.gold`. Override only when needed:

```bash
OPENAPI_BASE_URL=https://saba.gold bun run sync:openapi
```

## Notes

- Snapshots use the backend path prefix shape `/api/{module}/v1`.
- Do not hand-edit generated files under `src/generated/api`.
- Update `docs/api-contracts/mvp-api-contract-map.md` when staging routes or problem-detail codes change.
