import type { components as WalletComponents } from "@/generated/api/wallet";

import type { WalletAssetBalanceView } from "@/modules/wallet/types/wallet-portfolio";
import {
  compareWalletAssets,
  formatWalletBalanceBreakdown,
  getAssetDisplayName,
} from "@/modules/wallet/utils/format-wallet-balance";

type AccountDetail = WalletComponents["schemas"]["AccountDetail"];

export function mapWalletAccountToBalanceView(
  account: AccountDetail,
  locale: string = "en-US",
): WalletAssetBalanceView {
  const balances = {
    available: account.available_balance,
    locked: account.locked_balance,
    total: account.total_balance,
  };

  return {
    accountId: account.id,
    assetCode: account.asset_code,
    assetLabel: getAssetDisplayName(account.asset_code),
    status: account.status,
    balances,
    formatted: formatWalletBalanceBreakdown(account.asset_code, balances, locale),
    updatedAt: account.updated_at,
  };
}

export function mapWalletAccountsToBalanceViews(
  accounts: AccountDetail[],
  locale: string = "en-US",
): WalletAssetBalanceView[] {
  return [...accounts]
    .sort((left, right) => compareWalletAssets(left.asset_code, right.asset_code))
    .map((account) => mapWalletAccountToBalanceView(account, locale));
}
