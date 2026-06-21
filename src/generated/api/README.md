# Generated API client

OpenAPI-generated types and manifest metadata live in this directory.

- Entrypoint: `index.ts`
- Per-module schemas: `{module}/schema.ts`
- Contract snapshots: `contracts/openapi/{module}.openapi.json`
- Staging OpenAPI source: `https://saba.gold/api/{module}/v1/openapi.json`

Regenerate with:

```bash
bun run sync:openapi
bun run generate:api
```

Do not hand-write DTOs that duplicate generated types.
