# OpenAPI contract snapshots

These JSON files are the frontend contract-freeze source of truth for generated API types.

## Refresh workflow

Preferred order:

1. If the backend API is running, fetch live specs:

```bash
OPENAPI_BASE_URL=http://localhost:8080 pnpm sync:openapi
```

2. Otherwise export from the sibling `gold-trade` backend repository:

```bash
BACKEND_ROOT=../gold-trade pnpm sync:openapi
```

3. Regenerate TypeScript types:

```bash
pnpm generate:api
```

4. Verify generated output is committed and current:

```bash
pnpm check:api-drift
```

## Notes

- Snapshots use the default backend path prefix shape `/api/{module}/v1`.
- Do not hand-edit generated files under `src/generated/api`.
- Update `docs/api-contracts/mvp-api-contract-map.md` when backend routes or problem-detail codes change.
