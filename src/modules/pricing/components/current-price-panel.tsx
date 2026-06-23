import Link from "next/link";

import type { SelectedPriceView } from "@/modules/pricing/mappers/map-pricing-views";

type CurrentPricePanelProps = {
  price: SelectedPriceView;
};

export function CurrentPricePanel({ price }: CurrentPricePanelProps) {
  return (
    <section
      aria-label="Current selected price"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Current price</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {price.marketSymbol} · {price.source} · {price.marketStatusLabel}
          </p>
        </div>
        <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
          Backend selected
        </span>
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Buy price</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{price.buyPriceLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Sell price</dt>
          <dd className="font-mono font-medium text-zinc-900 dark:text-zinc-50">{price.sellPriceLabel}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Quote per base unit</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{price.quotePerBaseUnit}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-zinc-500">Effective from</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{price.effectiveFromLabel}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-zinc-500">Selected at</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{price.selectedAtLabel}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-zinc-500">Price snapshot</dt>
          <dd className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{price.priceSnapshotId}</dd>
        </div>
      </dl>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Review related audit events in{" "}
        <Link href="/admin/audit" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          Audit
        </Link>
        .
      </p>
    </section>
  );
}
