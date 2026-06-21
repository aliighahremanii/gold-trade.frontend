# Generated API client

OpenAPI-generated types and manifest metadata live in this directory.

- Entrypoint: `index.ts`
- Per-module schemas: `{module}/schema.ts`
- Contract snapshots: `contracts/openapi/{module}.openapi.json`

Regenerate with:

```bash
pnpm sync:openapi
pnpm generate:api
```

Do not hand-write DTOs that duplicate generated types.
