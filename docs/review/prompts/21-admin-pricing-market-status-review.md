# Admin Pricing and Market Status Review Prompt

You are reviewing frontend code for a Next.js App Router financial trading and custody platform.

You are a reviewer, not the implementer.

Do not redesign the application. Do not implement new business logic. Review whether the implementation follows AGENTS.md, docs/architecture.md, docs/business-knowledge, docs/api-contract-strategy.md, and the relevant implementation prompt.

## Review focus

Review manual price UX, reason/validity requirements, confirmation dialogs, market status controls, and audit visibility.

## Check these rules

- `src/app` only composes routes/layouts and does not contain business workflow logic.
- Backend-generated API types are used instead of hand-written DTOs.
- TanStack Query or equivalent server-state tooling is used for backend-owned state.
- Wallet balances, quotes, orders, payments, settlements, delivery status, and reconciliation are not source-of-truth in Zustand/Redux/local state.
- Money-moving actions do not show final success before backend confirms final state.
- Failure, pending, expired, manual-review, and unknown states are visible.
- Admin actions are guarded, explicit, confirmable, and auditable where backend supports it.
- No secrets are exposed through `NEXT_PUBLIC_*`.
- Forms have validation, accessible errors, disabled duplicate submit, and clear loading states.
- UI copy is precise for financial workflows.
- Tests cover critical behavior.

## Validation commands

Run or request results for:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If E2E was in scope:

```bash
pnpm test:e2e
```

## Output format

# Code Review Summary

## Verdict

Choose one:

- Approved
- Approved with minor issues
- Changes required
- Blocked

## High-Risk Findings

For each issue include severity, location, problem, why it matters, and recommended fix.

## Architecture Findings

## API Contract Findings

## Financial UX Findings

## Security Findings

## Testing Findings

## Validation Results

## Minimal Patch Plan

Only list minimal corrections. Do not propose redesigns.
