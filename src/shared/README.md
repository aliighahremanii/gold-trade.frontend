# Shared frontend layer

Cross-cutting UI, API, auth, config, and utilities used by multiple modules.

## Boundaries

- `shared` may not import from `modules`.
- Module-specific business UI belongs under `src/modules/{module}`.
- Generated API types live under `src/generated/api`.
