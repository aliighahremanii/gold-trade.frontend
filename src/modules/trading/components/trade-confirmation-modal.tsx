import type { QuoteSummaryView } from "@/modules/trading/mappers/map-quote-summary";

type TradeConfirmationModalProps = {
  isOpen: boolean;
  quote: QuoteSummaryView | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function TradeConfirmationModal({
  isOpen,
  quote,
  isSubmitting,
  onCancel,
  onConfirm,
}: TradeConfirmationModalProps) {
  if (!isOpen || !quote) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-confirmation-title"
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 id="trade-confirmation-title" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Confirm {quote.side} order
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          You are confirming a {quote.side} quote for {quote.quantityLabel} at {quote.totalIrrLabel} total
          IRR including fees. The backend will lock balances and process settlement.
        </p>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            {isSubmitting ? "Confirming..." : "Confirm order"}
          </button>
        </div>
      </div>
    </div>
  );
}
