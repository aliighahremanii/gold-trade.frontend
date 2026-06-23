"use client";

import { useEffect, useState } from "react";

import type { QuoteSummaryView } from "@/modules/trading/mappers/map-quote-summary";
import {
  formatQuoteCountdown,
  getQuoteRemainingSeconds,
  isQuoteExpired,
} from "@/modules/trading/utils/quote-expiry";

type QuoteSummaryPanelProps = {
  quote: QuoteSummaryView;
  isExpired: boolean;
  onConfirm: () => void;
  onStartOver: () => void;
  isConfirmDisabled: boolean;
};

export function QuoteSummaryPanel({
  quote,
  isExpired,
  onConfirm,
  onStartOver,
  isConfirmDisabled,
}: QuoteSummaryPanelProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(() =>
    getQuoteRemainingSeconds(quote.expiresAt),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsRemaining(getQuoteRemainingSeconds(quote.expiresAt));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [quote.expiresAt]);

  const expired = isExpired || isQuoteExpired(quote.expiresAt);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Quote ready</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {quote.marketSymbol} · {quote.side} · {quote.status}
          </p>
        </div>
        <div
          className={
            expired
              ? "rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
              : "rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          }
        >
          {expired ? "Expired" : formatQuoteCountdown(secondsRemaining)}
        </div>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Quantity</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{quote.quantityLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Unit price</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{quote.unitPriceLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Fees</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{quote.feeLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Total IRR</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{quote.totalIrrLabel}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-zinc-500">Price source</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{quote.priceSource}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirmDisabled || expired}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Review and confirm
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Start over
        </button>
      </div>
    </section>
  );
}
