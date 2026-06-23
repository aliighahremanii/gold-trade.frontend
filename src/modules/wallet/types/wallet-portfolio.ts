export type WalletBalanceBreakdown = {
  available: number;
  locked: number;
  total: number;
};

export type FormattedWalletBalance = {
  available: string;
  locked: string;
  total: string;
  unit: string;
  storedUnit: string;
};

export type WalletAssetBalanceView = {
  accountId: string;
  assetCode: string;
  assetLabel: string;
  status: string;
  balances: WalletBalanceBreakdown;
  formatted: FormattedWalletBalance;
  updatedAt: string;
};
