# Customer MVP Flows

## Deposit IRR

1. User opens deposit page.
2. User enters amount.
3. Backend creates payment/deposit intent.
4. User completes gateway/bank flow.
5. Frontend shows pending until backend confirms.
6. Wallet refetch shows IRR available balance.

## Buy Gold

1. User selects XAU/IRR buy.
2. User enters quantity in supported display unit.
3. Backend creates quote.
4. Frontend shows quote, fees, total, expiry.
5. User confirms before expiry.
6. Backend creates order, locks IRR, executes, settles.
7. Frontend shows each backend-visible state.
8. Wallet refetch shows XAU balance.

## Sell Gold

1. User selects XAU/IRR sell.
2. Backend creates sell quote.
3. User confirms before expiry.
4. Backend locks XAU, executes, settles.
5. Wallet refetch shows IRR balance.

## Physical Delivery

1. User chooses XAU delivery.
2. Backend validates deliverable amount and city.
3. Gold becomes locked when backend confirms request.
4. Admin approves/schedules.
5. User sees delivery status.
6. Completed delivery reduces custody obligation according to backend state.
