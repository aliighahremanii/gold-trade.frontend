export const MARKET_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
  { value: "manual-only", label: "Manual only" },
] as const;

export function formatMarketStatusLabel(status: string): string {
  const known = MARKET_STATUS_OPTIONS.find((option) => option.value === status);

  if (known) {
    return known.label;
  }

  return status;
}
