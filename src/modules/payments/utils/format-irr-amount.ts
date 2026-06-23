const DEFAULT_LOCALE = "en-US";

export function formatIrrAmount(amount: number, locale: string = DEFAULT_LOCALE): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)} IRR`;
}

export function parseIrrAmountInput(amountInput: string): number {
  const normalized = amountInput.trim().replace(/,/g, "");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    throw new Error("Enter a valid IRR amount in whole rials.");
  }

  return amount;
}

export function isValidIrrAmountInput(amountInput: string): boolean {
  try {
    parseIrrAmountInput(amountInput);
    return true;
  } catch {
    return false;
  }
}
