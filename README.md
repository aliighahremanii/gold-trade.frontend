# Trade Platform Frontend Agent Pack

This pack contains English-language instructions, architecture notes, business knowledge, implementation prompts, review prompts, and CI/CD templates for building the **Next.js App Router frontend** of the Trade Platform.

The backend already owns the business rules and bounded contexts. The frontend must expose those workflows safely, clearly, and consistently. The frontend is not allowed to become a parallel business-rule engine.

## Recommended frontend direction

- Next.js App Router with `src/app` used for routing and composition only.
- Feature-module structure under `src/modules`, aligned with backend bounded contexts.
- Generated OpenAPI client/types as the API source of truth.
- TanStack Query for server state and mutations.
- React Hook Form + Zod for forms and client-side input validation.
- Zustand only for local UI state, never for server-owned balances, orders, quotes, payments, or delivery state.
- Playwright for end-to-end workflow validation.

## Key folders in this pack

```text
.github/workflows/              # CI templates
.cursor/rules/                  # Cursor rule file
ci-cd/                          # Docker, Caddy, compose and CI notes
docs/                           # Architecture, business knowledge, testing, security
docs/prompts/                   # Implementation prompts
docs/review/prompts/            # Code review prompts
docs/business-knowledge/        # Business model and module knowledge
```

## How to use

1. Copy `AGENTS.md`, `CODEX.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `.cursor/rules/frontend-architecture.mdc` into the frontend repository.
2. Copy the `docs/` folder into the frontend repository.
3. Use `docs/prompt-order.md` as the canonical prompt execution order.
4. Run each implementation prompt with one agent, then run the matching review prompt with a different agent.
5. Do not let implementation agents redesign the backend contract or invent business rules.
