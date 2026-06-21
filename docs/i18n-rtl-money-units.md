# i18n, RTL, Money, and Units

The product likely targets Persian-speaking users and the Iranian gold market.

Frontend must be ready for:

- Persian labels
- RTL layout
- IRR display
- Toman display only as presentation if product requires it
- XAU display in gram/mg according to backend metadata
- clear distinction between stored unit and display unit

Do not convert final business amounts independently of backend rules. Use backend-provided precision and display metadata where available.
