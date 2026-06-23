export const XAU_IRR_MARKET_SYMBOL = "XAU-IRR";

export const TRADE_SIDE = {
  buy: "buy",
  sell: "sell",
} as const;

export type TradeSide = (typeof TRADE_SIDE)[keyof typeof TRADE_SIDE];

export const TRADE_DISPLAY_UNIT = "mg";

export function gramsInputToDisplayAmount(gramsInput: string): number {
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
