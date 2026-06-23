import type { WalletAssetBalanceView } from "@/modules/wallet/types/wallet-portfolio";

type WalletBalanceMetricProps = {
  label: string;
  value: string;
  unit: string;
};

function WalletBalanceMetric({ label, value, unit }: WalletBalanceMetricProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="font-mono text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
        {value}
        <span className="ms-1 text-sm font-medium text-zinc-500">{unit}</span>
      </p>
    </div>
  );
}

type WalletBalanceCardProps = {
  asset: WalletAssetBalanceView;
};

export function WalletBalanceCard({ asset }: WalletBalanceCardProps) {
  const isActive = asset.status.toLowerCase() === "active";

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{asset.assetLabel}</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {asset.assetCode}
            <span className="mx-2 text-zinc-300 dark:text-zinc-700">·</span>
            Stored in {asset.formatted.storedUnit}
          </p>
        </div>
        {!isActive ? (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            {asset.status}
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <WalletBalanceMetric label="Available" value={asset.formatted.available} unit={asset.formatted.unit} />
        <WalletBalanceMetric label="Locked" value={asset.formatted.locked} unit={asset.formatted.unit} />
        <WalletBalanceMetric label="Total" value={asset.formatted.total} unit={asset.formatted.unit} />
      </div>
    </article>
  );
}
