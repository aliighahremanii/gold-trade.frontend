# Business Knowledge — Frontend Context

## Product

The platform starts as a simple gold buy/sell and custody product.

Users can:

- deposit IRR
- hold IRR in wallet
- buy XAU/gold with IRR
- hold XAU/gold in wallet
- sell XAU/gold back to IRR
- withdraw IRR
- request physical gold delivery in one MVP city

Future expansion may include:

- USDT
- multiple liquidity providers
- best execution
- internal order book
- P2P trading
- multi-city delivery
- more advanced risk/compliance controls

## Frontend responsibility

The frontend must help users and admins understand the state of money-moving operations.

It must clearly show:

- what is being bought or sold
- unit and amount
- price source and expiry
- fees and total amount
- balance available and locked
- whether an operation is pending, failed, manually reviewed, or settled
- whether a delivery or withdrawal is waiting for admin or external settlement

## Concepts users must understand

- IRR wallet balance
- XAU wallet balance
- available balance
- locked balance
- quote
- quote expiry
- order
- trade/execution
- settlement
- physical delivery
- withdrawal
- manual review

## Concepts admins must understand

- market status
- manual price
- provider status
- pending orders
- failed settlements
- payment callbacks
- withdrawal approvals
- delivery queue
- ledger transactions
- audit records
- reconciliation mismatches

## UX risks

Bad financial UX can create real business risk.

Avoid:

- showing stale balances without loading or last-updated context
- hiding locked balance
- treating pending settlement as final
- letting users confirm expired quotes
- presenting manual-review trades as failed
- presenting unknown provider execution as safe success
- hiding admin price history
- hiding audit trails for sensitive actions
- using ambiguous terms like "successful" before settlement completes
