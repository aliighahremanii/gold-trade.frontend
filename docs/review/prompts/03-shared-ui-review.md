# Shared UI System Review Prompt (Optional)

You are reviewing frontend code for a Next.js App Router financial trading and custody platform.

You are a reviewer, not the implementer.

Do not redesign the application. Do not implement new business logic. Review whether the shared UI implementation follows AGENTS.md, docs/architecture.md, docs/business-knowledge, docs/api-contract-strategy.md, docs/design-system.md, and `docs/prompts/03-shared-ui.md`.

This review applies only when the optional shared UI prompt was in scope.


## Review focus

Review the shared UI system under `src/shared/ui` for:

- completeness against trading-platform presentation needs (primitives + financial display shells)
- customization and theme flexibility (tokens, variants, slots, `className`, escape hatches)
- environment agnosticism (customer/admin, light/dark, LTR/RTL readiness)
- architecture boundaries (no module imports, no business logic, no API fetching in primitives)
- accessibility and financial UX presentation quality
- test coverage for critical formatters, variants, and a11y behavior
- documentation for consumers and theme overrides

Figma is inspiration only — do not reject implementation solely for visual drift from Figma if tokens and customization hooks are sound.


## Check these rules

### Architecture

- Shared UI lives under `src/shared/ui` and does not import from `src/modules/**`.
- Module-specific compositions remain under `src/modules/{module}/components`.
- Primitives are presentation-only: no price/fee/balance/settlement calculation.
- No TanStack Query, fetch, or generated API clients inside `src/shared/ui` components.
- No third-party UI libraries (Radix, shadcn, Headless UI, etc.) — all primitives built from native HTML + React + ARIA.
- Exports are stable and documented; barrel file does not create circular deps.

### Customization and theming

- Semantic design tokens exist as CSS custom properties (not raw Tailwind palette classes in components).
- `cn()` utility uses `clsx` + `tailwind-merge` for safe class composition.
- Components expose variant/size/intent (or equivalent) APIs consistently.
- `className` overrides work without forking components.
- Theme switching (at least light/dark) is supported via `ThemeProvider`/`useTheme()`.
- Hardcoded colors/spacing in component bodies are minimal; violations should be flagged.

### Trading / financial presentation

- Amount and unit display components exist or are explicitly deferred with a justified gap list.
- Workflow status badges cover AGENTS.md financial states (including unknown/manual review/pending/failed/expired).
- Quote countdown, confirmation modal, and empty/error/loading patterns exist or are scheduled with clear gaps.
- Display components accept pre-formatted or backend-sourced values via props — they do not invent amounts.
- Sensitive actions use explicit confirm patterns; destructive styling is not the only guard.

### Accessibility

- Interactive primitives are keyboard operable with visible focus.
- Dialogs/drawers trap focus and restore on close where applicable.
- Form fields associate labels, hints, and errors accessibly.
- Financial amounts use readable typography (e.g. tabular figures where appropriate).
- Color is not the only carrier of status meaning.

### RTL / i18n

- No hardcoded `left`/`right` CSS values — all use logical properties (`margin-inline-start`, `padding-inline-start`, `inset-inline-start`, `text-align: start`).
- Components correctly mirror layout when `dir="rtl"` is set on a parent.
- Number and date formatting accept a `locale` prop and use `Intl.NumberFormat` / `Intl.DateTimeFormat`.
- No hardcoded user-facing strings in shared UI primitives — all text received via props or `next-intl`.
- `next-intl` is used for translation, not manual string maps.
- Farsi (primary locale) renders correctly with Persian-Indic numerals and RTL text direction.

### Testing and docs

- `src/shared/ui/README.md` explains boundaries, customization, and migration from inline styles.
- Unit tests cover variant resolution and critical display formatters.
- Examples or gallery exist for major primitives.
- Validation commands pass.

### General (still apply)

- No secrets through `NEXT_PUBLIC_*`.
- No fake success states embedded in shared components.
- `src/app` pages remain thin; shared UI does not absorb workflow logic.
- No hardcoded `left`/`right` CSS properties — logical properties only.


## Validation commands

Run or request results for:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
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

## Customization / Theming Findings

## Financial Presentation Findings

## Accessibility Findings

## Testing / Documentation Findings

## Validation Results

## Minimal Patch Plan

Only list minimal corrections. Do not propose a full visual redesign.

## Deferred Scope (if applicable)

List prompt deliverables intentionally skipped, with whether they are safe to defer before customer/admin MVP flows.
