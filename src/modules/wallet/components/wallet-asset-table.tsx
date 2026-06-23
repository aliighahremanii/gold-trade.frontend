import type { WalletAssetBalanceView } from "@/modules/wallet/types/wallet-portfolio";

type WalletAssetRowProps = {
  asset: WalletAssetBalanceView;
};

export function WalletAssetRow({ asset }: WalletAssetRowProps) {
  const isActive = asset.status.toLowerCase() === "active";

  return (
    <tr className="border-t border-zinc-200 dark:border-zinc-800">
      <td className="px-4 py-3 align-top">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-zinc-900 dark:text-zinc-50">{asset.assetCode}</span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{asset.assetLabel}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <span className="font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50">
          {asset.formatted.available} {asset.formatted.unit}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        <span className="font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50">
          {asset.formatted.locked} {asset.formatted.unit}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        <span className="font-mono text-sm font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
          {asset.formatted.total} {asset.formatted.unit}
        </span>
      </td>
      <td className="px-4 py-3 align-top">
        <span
          className={
            isActive
              ? "text-sm text-zinc-600 dark:text-zinc-400"
              : "text-sm font-medium text-amber-700 dark:text-amber-300"
          }
        >
          {asset.status}
        </span>
      </td>
    </tr>
  );
}

type WalletAssetTableProps = {
  assets: WalletAssetBalanceView[];
};

export function WalletAssetTable({ assets }: WalletAssetTableProps) {
  if (assets.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        No wallet accounts are available yet. Balances will appear here once the backend opens IRR and XAU
        accounts.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full text-start text-sm">
        <thead className="bg-zinc-100 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Asset
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Available
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Locked
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Total
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-950">
          {assets.map((asset) => (
            <WalletAssetRow key={asset.accountId} asset={asset} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
