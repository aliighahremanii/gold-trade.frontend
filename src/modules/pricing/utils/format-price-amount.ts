const DEFAULT_LOCALE = "en-US";

export function formatIrrPriceAmount(amount: number, locale: string = DEFAULT_LOCALE): string {
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)} IRR`;
}

export function formatPricingTimestamp(value: string, locale: string = DEFAULT_LOCALE): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function parseIrrPriceInput(value: string): number | null {
  const normalized = value.trim().replace(/,/g, "");

  if (!normalized || !/^\d+$/.test(normalized)) {
    return null;
  }

  const parsed = Number(normalized);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function toDateTimeLocalValue(isoValue?: string): string {
  if (!isoValue) {
    return "";
  }

  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string): string | undefined {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const date = new Date(trimmed);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

export function isValidPriceValidityWindow(
  effectiveFrom?: string,
  expiresAt?: string,
): boolean {
  if (!effectiveFrom || !expiresAt) {
    return true;
  }

  const effectiveDate = new Date(effectiveFrom);
  const expiresDate = new Date(expiresAt);

  if (Number.isNaN(effectiveDate.getTime()) || Number.isNaN(expiresDate.getTime())) {
    return false;
  }

  return expiresDate.getTime() > effectiveDate.getTime();
}
