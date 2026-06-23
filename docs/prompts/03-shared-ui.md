# Shared UI System Prompt

You are working inside an existing Next.js App Router frontend repository for a financial gold trading and custody platform. Follow AGENTS.md for all non-negotiable rules.


## Objective

Build a **complete, reusable, highly customizable, environment-agnostic** shared UI system under `src/shared/ui`.

**Core primitives** (buttons, forms, inputs, dialogs, badges, layout) — built from scratch with native HTML elements, React, and ARIA. Maximum control, no third-party UI libraries (no Radix, no shadcn, no Headless UI, no Chakra, no MUI).

**Complex trade-specific components** (charts, advanced data grids, rich text editors) — third-party libraries are acceptable where building from scratch would be impractical. Wrap them behind project-owned APIs in `src/shared/ui` so the rest of the app never imports the library directly.

Dependencies: Tailwind CSS, `clsx` + `tailwind-merge`, `next-intl` for internationalization.

Visual design is **not frozen**. The Figma file below is **inspiration and a starting theme reference only** — it is incomplete and may change at any time. Do not treat it as a pixel-perfect spec.

- Figma (inspiration only): https://www.figma.com/design/LKmc2eRwI9G96WaaaM8kfx/Dr-Gold?node-id=0-1


## Design principles

1. **Token-first theming** — Semantic color roles, spacing, radii, typography, shadows, motion, and z-index live in CSS custom properties and Tailwind `@theme` config. Components consume tokens, never raw hex values.
2. **Composable primitives** — Small, focused primitives with `className` merge, slot props, and polymorphic `as` prop. Avoid monolithic components.
3. **Variant-driven APIs** — Consistent variant system (`intent`, `size`, `density`) so customer and admin surfaces diverge without forking.
4. **Environment agnostic** — Same primitives work in customer/admin shells, light/dark/custom themes, compact/dense layouts, and LTR/RTL.
5. **Accessible by default** — Built from native elements with correct ARIA roles, keyboard navigation, focus trapping/restoration, visible focus rings, and screen-reader-friendly patterns.
6. **Presentation only** — No price, fee, balance, or settlement calculations. No API fetching. Data enters via props only.
7. **RTL-first** — Every component must work correctly in both LTR and RTL layouts. Use logical properties (`margin-inline-start` not `margin-left`), `dir` attribute awareness, and CSS `:dir()` selectors where needed. Farsi is the primary language.
8. **Incremental delivery** — Ship in sub-phases. Each must pass lint, typecheck, test, and build before proceeding.


## Business constraints

- The platform starts with XAU/IRR trading.
- Users deposit IRR, buy gold, hold balances, sell gold, withdraw IRR, and request physical delivery.
- Admins operate manual pricing, market status, approvals, delivery, audit, and reconciliation.
- Backend is the source of truth for price, quote, balance, order, settlement, payment, delivery, and ledger state.
- MVP non-goals from architecture still apply (no order book, P2P, advanced charting, etc.) unless the primitive is clearly reusable later without building those features now.


## Scope — what belongs in `src/shared/ui`

### Sub-phase A — Foundation

- Install `clsx`, `tailwind-merge`, and `next-intl` as dependencies.
- Create `src/shared/ui/lib/cn.ts` — the `cn()` utility: `clsx(...inputs)` piped through `twMerge()`.
- Theme contract via CSS custom properties in `src/app/globals.css` and Tailwind `@theme` extension:
  - Semantic color roles: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-primary`, `--color-primary-fg`, `--color-danger`, `--color-warning`, `--color-success`, `--color-accent`
  - Spacing scale: `--space-1` through `--space-16` (4px base)
  - Radius scale: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
  - Typography: `--font-sans`, `--font-mono`, size scale via Tailwind
  - Elevation: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
  - Motion: `--duration-fast` (100ms), `--duration-normal` (200ms), `--duration-slow` (300ms)
- Theme system architecture:
  - Built-in themes: `light`, `dark` (define full token sets for both)
  - User custom themes: `ThemeProvider` accepts a `themeOverrides` prop (partial token map) that merges on top of the base theme. Users can customize any semantic token without editing component source.
  - Theme persistence: user's theme choice stored in `localStorage` and applied via `data-theme` attribute on `<html>`.
  - `useTheme()` hook returns: `{ theme, setTheme, resolvedTokens }` — components read tokens from context, never from `localStorage` directly.
- RTL/i18n foundation:
  - `next-intl` handles all translation, locale routing, and message loading.
  - Supported locales: `fa` (Farsi, primary), plus 7 others. Define locale config in `src/i18n/config.ts`.
  - `DirectionProvider` reads locale from `next-intl` context and sets `dir="rtl"` for Farsi and other RTL locales, `dir="ltr"` for others.
  - All components use CSS logical properties: `margin-inline-start`/`end`, `padding-inline-start`/`end`, `border-inline-start`/`end`, `inset-inline-start`/`end`.
  - Tailwind config includes logical property utilities (`ms-*`, `ps-*`, `start-*` instead of `ml-*`, `pl-*`, `left-*`).
  - No hardcoded `left`/`right` values in component styles — use `start`/`end` equivalents.
  - Number formatting: components accept `locale` prop for correct digit rendering (Farsi uses Persian-Indic numerals `۰۱۲۳...`). Use `Intl.NumberFormat` with the active locale.
  - Date formatting: use `Intl.DateTimeFormat` with locale. Components accept `locale` prop or read from context.
  - Component text content: use `next-intl` `useTranslations()` or accept translated strings via props. Shared UI primitives themselves do NOT contain hardcoded strings — they receive translated text from the consuming module.
- Utility helpers: `focus-ring` (consistent focus-visible outline), `visually-hidden` (sr-only), responsive container.
- Mobile-first responsive approach: all primitives work at 320px+ and scale up. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) in components, not fixed widths.

### Sub-phase B — Core primitives

Build from native HTML elements + React + ARIA. No third-party UI libraries.

**Priority 1 — Build first** (every module needs these immediately):

- `Button`, `IconButton`, `LinkButton` — polymorphic `as` prop (renders `<button>` or `<a>`), variant/intent/size props, `disabled` and `loading` states
- `Input`, `Textarea`, `Select` — with `Label`, `Hint`, `ErrorMessage` composition
- `Field` — label + input slot + hint + error shell (presentation only; validation lives in modules)
- `Badge` — variant-driven (default, success, warning, danger, info)
- `Card` — surface container with optional header/footer slots
- `Skeleton`, `Spinner` — loading states

**Priority 2 — Build next** (needed for customer MVP flows):

- `Checkbox`, `Radio`, `Switch` — accessible toggle controls with label association
- `Dialog` — focus trap, `Escape` to close, `aria-modal`, `aria-labelledby`, restore focus on close. Build with `<dialog>` element or `role="dialog"` + `aria-modal="true"` + `inert` on background.
- `Alert`, `Callout` — `role="alert"` or `role="status"`, variant-driven
- `Tabs` — keyboard arrow navigation, `aria-selected`, `aria-controls`/`aria-labelledby` pairing
- `Table` — `<table>` with `head`, `body`, `row`, `cell`, `empty state` composition
- `Separator` — `role="separator"` or `<hr>`
- `Badge` variants for financial states

**Priority 3 — Build when needed** (admin MVP, advanced patterns):

- `Drawer` / `Sheet` — slide-in panel, focus trap, backdrop click to close
- `Popover` — positioned relative to trigger, click outside to close, arrow optional
- `Tooltip` — hover/focus triggered, `role="tooltip"`, `aria-describedby`, delay on show
- `Accordion`, `Collapsible` — `aria-expanded`, `aria-controls`, animated height
- `Toast` / notification — provider pattern, stacking, auto-dismiss, `role="status"` or `role="alert"`
- `Stack`, `Grid`, `Box` — layout primitives with gap/alignment props

### Sub-phase C — Financial / trading presentation primitives

These are **display and interaction shells** for trading workflows. They accept formatted values and status enums from modules; they do not derive business state.

- `MoneyAmount` / `AssetAmount` — currency and asset unit display with locale/dir policies, optional sign coloring, tabular figures
- `UnitLabel` — XAU, IRR, gram, etc.
- `BalanceDisplay` — available / locked / total presentation slots (values passed in, not fetched)
- `QuoteSummary` — line items for quote breakdown (subtotal, fees, total) as slots/props
- `QuoteCountdown` — visual expiry countdown driven by `expiresAt` prop
- `WorkflowStatusBadge` — maps known workflow states to visual variants (idle, loading, quote_ready, quote_expired, confirming, pending, balance_locked, executing, settlement_pending, settled, failed, manual_review_required, unknown)
- `MarketStatusBadge` — open / closed / halted presentation
- `ConfirmationModal` — destructive/sensitive action pattern with explicit confirm/cancel and loading disable
- `EmptyState`, `ErrorState`, `LoadingState` — consistent panels for lists and workflows
- `PageHeader`, `SectionHeader`, `DescriptionList` / `KeyValue` rows for detail views
- `Stepper` / `WizardStep` shells for multi-step flows
- `DataTableToolbar` — search/filter/sort chrome without embedding domain filters
- `TimestampDisplay` — relative/absolute formatting hook (formatter injected or passed as string)
- `CopyableId` — order/payment/reference id display with copy affordance
- `AuditMetadata` — created/updated/by presentation block

### Sub-phase D — Patterns and docs

- Create `src/shared/ui/_examples/page.tsx` — a gallery page showing every primitive with variant combinations. This is the lightweight alternative to Storybook.
- Unit tests: variant class resolution for Button/Badge/Alert, `cn()` behavior, financial formatter correctness (MoneyAmount, QuoteCountdown), Dialog focus trap, keyboard navigation for Tabs.
- Update `src/shared/ui/README.md` with: component API reference, token customization guide, migration notes for replacing inline Tailwind in `src/shared/layout`.


## Customization requirements

Every primitive should support as many of the following as practical:

- `className` merge on root and key sub-elements (use `clsx` + `tailwind-merge` via a `cn()` utility)
- `variant` / `size` / `intent` props with documented defaults
- `children` and slot props for icons, labels, actions, footer
- Theme token overrides via CSS variables without editing component source
- Optional `as` prop for polymorphic usage (button vs anchor)
- No hard dependency on a single icon set — accept `ReactNode` icons

Document how to:

- Re-skin the entire app from tokens
- Override a single component variant
- Add a new variant without breaking existing consumers


## Forbidden

- Do not use third-party UI component libraries for core primitives (Radix, shadcn/ui, Headless UI, Chakra, MUI, etc.). Build buttons, forms, inputs, dialogs, badges, and layout from native HTML + React + ARIA.
- Third-party libraries ARE acceptable for complex trade-specific components (charts, advanced data grids) — but wrap them behind project-owned APIs.
- Do not import from `src/modules/**` inside `src/shared/ui`.
- Do not put module-specific business UI in `src/shared/ui` (e.g. "BuyGoldPanel").
- Do not calculate final prices, fees, balances, or settlement results in shared components.
- Do not fetch API data inside primitives (pass data via props; data fetching stays in module hooks/flows).
- Do not use `margin-left`, `margin-right`, `padding-left`, `padding-right`, `text-align: left/right`, `float: left/right`, or CSS `left`/`right` positioning in components — use logical properties (`margin-inline-start`, `padding-inline-start`, `text-align: start`, etc.).
- Do not treat Figma as the source of truth for spacing, color names, or component APIs.
- Do not implement MVP workflow pages in this prompt — only the shared primitive layer.


## Suggested file layout

```text
src/shared/ui/
  README.md
  theme/
  primitives/
  financial/
  patterns/
  lib/
  index.ts
```

Adjust names to match repo conventions, but keep financial primitives separate from generic primitives.


## Validation

After each sub-phase:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

Add or extend tests when introducing formatters, variant maps, or accessibility behavior.


## Final response

Summarize:

- sub-phase completed (A/B/C/D)
- files and exports added
- theme/token contract and how to customize it
- components delivered vs deferred
- examples or gallery location
- validation commands and results
- assumptions, Figma gaps, and recommended follow-ups for module migrations
