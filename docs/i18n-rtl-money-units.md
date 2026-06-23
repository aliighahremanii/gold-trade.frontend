# i18n, RTL, Money, and Units

## Languages

- `next-intl` handles translations, locale routing, and message loading.
- Primary locale: `fa` (Farsi, RTL).
- ~8 languages total. Define all supported locales in `src/i18n/config.ts`.

## RTL

- Farsi is RTL. All shared UI components use CSS logical properties exclusively.
- No `margin-left`, `margin-right`, `padding-left`, `right`, `left` in component styles.
- Use `margin-inline-start`/`end`, `padding-inline-start`/`end`, `inset-inline-start`/`end`, `text-align: start`/`end`.
- `DirectionProvider` reads locale from `next-intl` context and sets `dir` attribute.

## Money display

- IRR display as primary currency.
- Toman display only as presentation if product requires it (conversion is a backend concern).
- Use `Intl.NumberFormat` with the active locale for digit rendering (Farsi uses Persian-Indic numerals).
- Never convert final business amounts independently of backend rules. Use backend-provided precision and display metadata.

## Asset display

- XAU display in gram/mg according to backend metadata.
- Clear distinction between stored unit and display unit.
- Components accept `locale` prop for correct number formatting.
