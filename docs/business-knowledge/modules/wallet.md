# Wallet Frontend Knowledge

Wallet frontend shows user-facing asset balances.

Must distinguish:

- available balance
- locked balance
- total balance
- pending operations when available

Financial UX rule:

Never mutate balances optimistically after a money-moving mutation. Refetch or subscribe to backend state after confirmation.
