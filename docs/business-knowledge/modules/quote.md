# Quote Frontend Knowledge

Quote frontend shows a temporary price offer for a user operation.

Must show:

- asset
- side: buy/sell
- quantity and display unit
- price
- fees
- total IRR amount
- expiry time/countdown
- source label if allowed by product

Quote confirmation must handle expiry, insufficient balance, manual review, provider errors, and idempotent retries.
