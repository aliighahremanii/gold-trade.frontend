type TradeAmountFormProps = {
  amount: string;
  sideLabel: string;
  isSubmitting: boolean;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
};

export function TradeAmountForm({
  amount,
  sideLabel,
  isSubmitting,
  onAmountChange,
  onSubmit,
}: TradeAmountFormProps) {
  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="trade-amount" className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Gold amount (grams)
        </label>
        <input
          id="trade-amount"
          name="amount"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          disabled={isSubmitting}
          onChange={(event) => onAmountChange(event.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          placeholder="e.g. 1.5"
        />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter the quantity for your {sideLabel.toLowerCase()} quote. Final price and fees come from the
          backend quote.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? "Requesting quote..." : "Get quote"}
      </button>
    </form>
  );
}
