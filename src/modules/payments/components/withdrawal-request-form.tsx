type WithdrawalRequestFormProps = {
  amount: string;
  bankAccountReference: string;
  isSubmitting: boolean;
  onAmountChange: (value: string) => void;
  onBankAccountReferenceChange: (value: string) => void;
  onSubmit: () => void;
};

export function WithdrawalRequestForm({
  amount,
  bankAccountReference,
  isSubmitting,
  onAmountChange,
  onBankAccountReferenceChange,
  onSubmit,
}: WithdrawalRequestFormProps) {
  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="withdraw-amount" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Withdrawal amount (IRR)
        </label>
        <input
          id="withdraw-amount"
          name="amount"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={amount}
          disabled={isSubmitting}
          onChange={(event) => onAmountChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="e.g. 2000000"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="bank-account-reference"
          className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
        >
          Bank account reference
        </label>
        <input
          id="bank-account-reference"
          name="bankAccountReference"
          type="text"
          autoComplete="off"
          value={bankAccountReference}
          disabled={isSubmitting}
          onChange={(event) => onBankAccountReferenceChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="Saved payout account reference"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          The backend locks wallet balance when the withdrawal is created. Payout status updates from payment
          APIs.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Preparing review..." : "Review withdrawal"}
      </button>
    </form>
  );
}
