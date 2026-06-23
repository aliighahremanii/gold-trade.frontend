export const XAU_ASSET_CODE = "XAU";

export function gramsInputToMilligrams(gramsInput: string): number {
  const grams = Number(gramsInput.trim());

  if (!Number.isFinite(grams) || grams <= 0) {
    throw new Error("Enter a valid gold amount greater than zero.");
  }

  return Math.round(grams * 1000);
}

export function isValidGramsInput(gramsInput: string): boolean {
  const trimmed = gramsInput.trim();
  if (!trimmed) {
    return false;
  }

  const grams = Number(trimmed);
  return Number.isFinite(grams) && grams > 0;
}

export function formatMilligramsAsGrams(amountMg: number, locale = "en-US"): string {
  const grams = amountMg / 1000;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(grams)} g`;
}
