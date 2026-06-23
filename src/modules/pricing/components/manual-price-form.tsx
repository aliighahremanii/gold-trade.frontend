import { AuthFormField } from "@/modules/identity/components/auth-form-field";

type ManualPriceFormProps = {
  buyPrice: string;
  sellPrice: string;
  quotePerBaseUnit: string;
  reason: string;
  effectiveFrom: string;
  expiresAt: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  onBuyPriceChange: (value: string) => void;
  onSellPriceChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onEffectiveFromChange: (value: string) => void;
  onExpiresAtChange: (value: string) => void;
  onSubmit: () => void;
};

export function ManualPriceForm({
  buyPrice,
  sellPrice,
  quotePerBaseUnit,
  reason,
  effectiveFrom,
  expiresAt,
  isSubmitting,
  isDisabled,
  onBuyPriceChange,
  onSellPriceChange,
  onReasonChange,
  onEffectiveFromChange,
  onExpiresAtChange,
  onSubmit,
}: ManualPriceFormProps) {
  return (
    <section
      aria-label="Manual price form"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Set manual price</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Submit buy and sell prices with a reason and optional validity window. The backend stores the
          snapshot and selects pricing according to market policy.
        </p>
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField
            id="manual-buy-price"
            label="Buy price (IRR)"
            inputMode="numeric"
            autoComplete="off"
            value={buyPrice}
            onChange={(event) => onBuyPriceChange(event.target.value)}
            required
          />
          <AuthFormField
            id="manual-sell-price"
            label="Sell price (IRR)"
            inputMode="numeric"
            autoComplete="off"
            value={sellPrice}
            onChange={(event) => onSellPriceChange(event.target.value)}
            required
          />
        </div>

        <AuthFormField
          id="manual-quote-per-base-unit"
          label="Quote per base unit"
          value={quotePerBaseUnit}
          readOnly
        />

        <AuthFormField
          id="manual-price-reason"
          label="Reason"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthFormField
            id="manual-effective-from"
            label="Effective from (optional)"
            type="datetime-local"
            value={effectiveFrom}
            onChange={(event) => onEffectiveFromChange(event.target.value)}
          />
          <AuthFormField
            id="manual-expires-at"
            label="Expires at (optional)"
            type="datetime-local"
            value={expiresAt}
            onChange={(event) => onExpiresAtChange(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isDisabled}
          className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {isSubmitting ? "Submitting..." : "Review manual price"}
        </button>
      </form>
    </section>
  );
}
