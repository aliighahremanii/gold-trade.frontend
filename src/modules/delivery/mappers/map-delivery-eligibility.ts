import type { components as WalletComponents } from "@/generated/api/wallet";
import { formatMilligramsAsGrams, XAU_ASSET_CODE } from "@/modules/delivery/utils/format-xau-amount";

type AccountDetail = WalletComponents["schemas"]["AccountDetail"];

export type DeliveryEligibilityView = {
  assetCode: string;
  availableLabel: string;
  lockedLabel: string;
  totalLabel: string;
  hasAccount: boolean;
  accountStatus: string | null;
};

export function mapXauWalletToEligibility(
  accounts: AccountDetail[],
  locale = "en-US",
): DeliveryEligibilityView {
  const xauAccount = accounts.find((account) => account.asset_code === XAU_ASSET_CODE);

  if (!xauAccount) {
    return {
      assetCode: XAU_ASSET_CODE,
      availableLabel: formatMilligramsAsGrams(0, locale),
      lockedLabel: formatMilligramsAsGrams(0, locale),
      totalLabel: formatMilligramsAsGrams(0, locale),
      hasAccount: false,
      accountStatus: null,
    };
  }

  return {
    assetCode: xauAccount.asset_code,
    availableLabel: formatMilligramsAsGrams(xauAccount.available_balance, locale),
    lockedLabel: formatMilligramsAsGrams(xauAccount.locked_balance, locale),
    totalLabel: formatMilligramsAsGrams(xauAccount.total_balance, locale),
    hasAccount: true,
    accountStatus: xauAccount.status,
  };
}
