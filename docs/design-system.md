# Design System Notes

Canonical implementation prompt: `docs/prompts/03-shared-ui.md`  
Review prompt: `docs/review/prompts/03-shared-ui-review.md`

Visual reference (inspiration only, incomplete, subject to change):  
https://www.figma.com/design/LKmc2eRwI9G96WaaaM8kfx/Dr-Gold?node-id=0-1

## Principles

- Token-first theming; components consume semantic roles, not one-off colors.
- Highly customizable via variants, slots, and `className` overrides.
- Environment agnostic: customer/admin, any theme, any direction, any locale.
- Presentation only — no business rules or API fetching in primitives.
- RTL-first — all components use CSS logical properties; Farsi is the primary language.

## Dependencies

- Tailwind CSS — styling
- `clsx` + `tailwind-merge` — class composition via `cn()` utility
- `next-intl` — internationalization, locale routing, translations
- No third-party UI component libraries for core primitives

## Library strategy

- **Core primitives** (buttons, forms, inputs, dialogs, badges, layout) — built from scratch with native HTML elements, React, and ARIA. Maximum control.
- **Complex trade-specific components** (charts, advanced data grids) — third-party libraries acceptable. Must be wrapped behind project-owned APIs in `src/shared/ui`.

## Themes

- Built-in: `light` and `dark` — full semantic token sets for both.
- User custom themes: `ThemeProvider` accepts `themeOverrides` (partial token map) merged on top of base theme.
- Persistence: user choice stored in `localStorage`, applied via `data-theme` attribute on `<html>`.
- `useTheme()` hook: `{ theme, setTheme, resolvedTokens }`.

## Internationalization

- `next-intl` handles translations, locale routing, and message loading.
- Primary locale: `fa` (Farsi, RTL). ~8 languages total.
- All components use CSS logical properties (`margin-inline-start`, `padding-inline-start`, `inset-inline-start`).
- Number formatting: `Intl.NumberFormat` with locale (Farsi renders Persian-Indic numerals).
- Date formatting: `Intl.DateTimeFormat` with locale.
- No hardcoded user-facing strings in shared UI primitives — text received via props or `useTranslations()`.

## Recommended building blocks

- accessible Button, Input, Select, Dialog, Drawer, Alert, Toast, Badge, Table, Tabs, Skeleton
- financial status badges (workflow, market, payment, delivery)
- amount and unit display components (IRR, XAU, gram)
- quote summary and countdown presentation
- confirmation modal for sensitive actions
- empty, error, and loading state panels
- admin data table primitives (chrome only)

Shared UI primitives belong under `src/shared/ui`.  
Module-specific compositions belong under `src/modules/{module}/components`.
