# delivery module

Frontend workflows and UI for the **delivery** bounded context.

## Responsibility

Physical delivery request and admin delivery operations.

## Structure

- `api/` — query keys, hooks, and mutation wrappers around generated client
- `components/` — module-specific UI
- `flows/` — page-level workflow components
- `forms/` — module-specific form models and components
- `hooks/` — module-specific hooks
- `mappers/` — DTO to view model mapping when needed
- `types/` — frontend-only view types
- `utils/` — module-specific helpers

## Rules

- Do not duplicate backend business rules here.
- Use generated OpenAPI types from `src/generated/api`.
- Keep server-owned financial state in TanStack Query, not global client stores.
