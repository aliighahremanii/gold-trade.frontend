# Pricing Frontend Knowledge

Pricing frontend exists mostly for admin/backoffice.

It must show:

- current price source
- provider/API price
- admin/manual price
- market status: open, closed, manual-only
- validity window
- who changed manual price and why, if backend exposes it

Do not let customer UI depend on locally calculated prices. Customer trades must use backend-created quotes.
