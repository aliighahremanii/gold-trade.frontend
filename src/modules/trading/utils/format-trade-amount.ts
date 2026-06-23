const DEFAULT_LOCALE = "en-US";

export function formatTradeAmount(
  assetCode: string,
  storedAmount: number,
  locale: string = DEFAULT_LOCALE,
): string {
  if (assetCode === "IRR") {
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(storedAmount)} IRR`;
  }

  if (assetCode === "XAU") {
    const grams = storedAmount / 1000;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(grams)} g`;
  }

  return `${new Intl.NumberFormat(locale).format(storedAmount)} ${assetCode}`;
}

export function formatTradeDisplayAmount(
  displayAmount: number,
  displayUnit: string,
  locale: string = DEFAULT_LOCALE,
): string {
  if (displayUnit === "mg") {
    const grams = displayAmount / 1000;
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(grams)} g`;
  }

  return `${new Intl.NumberFormat(locale).format(displayAmount)} ${displayUnit}`;
}
