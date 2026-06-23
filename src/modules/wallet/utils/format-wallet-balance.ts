const DEFAULT_LOCALE = "en-US";

type AssetDisplayRule = {
  label: string;
  storedUnit: string;
  displayUnit: string;
  toDisplayAmount: (storedAmount: number) => number;
  maximumFractionDigits: number;
};

const ASSET_DISPLAY_RULES: Record<string, AssetDisplayRule> = {
  IRR: {
    label: "Iranian Rial",
    storedUnit: "rial",
    displayUnit: "IRR",
    toDisplayAmount: (storedAmount) => storedAmount,
    maximumFractionDigits: 0,
  },
  XAU: {
    label: "Gold",
    storedUnit: "mg",
    displayUnit: "g",
    toDisplayAmount: (storedAmount) => storedAmount / 1000,
    maximumFractionDigits: 3,
  },
};

const FALLBACK_ASSET_RULE: AssetDisplayRule = {
  label: "Asset",
  storedUnit: "unit",
  displayUnit: "unit",
  toDisplayAmount: (storedAmount) => storedAmount,
  maximumFractionDigits: 0,
};

export function getAssetDisplayRule(assetCode: string): AssetDisplayRule {
  return ASSET_DISPLAY_RULES[assetCode] ?? {
    ...FALLBACK_ASSET_RULE,
    label: assetCode,
    displayUnit: assetCode,
  };
}

export function getAssetDisplayName(assetCode: string): string {
  return getAssetDisplayRule(assetCode).label;
}

export function formatWalletBalanceAmount(
  assetCode: string,
  storedAmount: number,
  locale: string = DEFAULT_LOCALE,
): { formatted: string; unit: string; storedUnit: string } {
  const rule = getAssetDisplayRule(assetCode);
  const displayAmount = rule.toDisplayAmount(storedAmount);

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: rule.maximumFractionDigits,
  }).format(displayAmount);

  return {
    formatted,
    unit: rule.displayUnit,
    storedUnit: rule.storedUnit,
  };
}

export function formatWalletBalanceBreakdown(
  assetCode: string,
  balances: { available: number; locked: number; total: number },
  locale: string = DEFAULT_LOCALE,
) {
  const available = formatWalletBalanceAmount(assetCode, balances.available, locale);
  const locked = formatWalletBalanceAmount(assetCode, balances.locked, locale);
  const total = formatWalletBalanceAmount(assetCode, balances.total, locale);

  return {
    available: available.formatted,
    locked: locked.formatted,
    total: total.formatted,
    unit: available.unit,
    storedUnit: available.storedUnit,
  };
}

export const WALLET_PORTFOLIO_ASSET_ORDER = ["IRR", "XAU"] as const;

export function compareWalletAssets(leftAssetCode: string, rightAssetCode: string): number {
  const leftIndex = WALLET_PORTFOLIO_ASSET_ORDER.indexOf(
    leftAssetCode as (typeof WALLET_PORTFOLIO_ASSET_ORDER)[number],
  );
  const rightIndex = WALLET_PORTFOLIO_ASSET_ORDER.indexOf(
    rightAssetCode as (typeof WALLET_PORTFOLIO_ASSET_ORDER)[number],
  );

  if (leftIndex === -1 && rightIndex === -1) {
    return leftAssetCode.localeCompare(rightAssetCode);
  }

  if (leftIndex === -1) {
    return 1;
  }

  if (rightIndex === -1) {
    return -1;
  }

  return leftIndex - rightIndex;
}
