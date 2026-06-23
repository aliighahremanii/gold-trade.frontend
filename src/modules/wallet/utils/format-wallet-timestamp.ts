export function formatWalletLastUpdated(
  isoTimestamp: string,
  locale: string = "en-US",
): string {
  const updatedAt = new Date(isoTimestamp);

  if (Number.isNaN(updatedAt.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(updatedAt);
}

export function getLatestWalletUpdatedAt(accounts: { updatedAt: string }[]): string | null {
  if (accounts.length === 0) {
    return null;
  }

  return accounts.reduce<string | null>((latest, account) => {
    if (!latest) {
      return account.updatedAt;
    }

    return new Date(account.updatedAt) > new Date(latest) ? account.updatedAt : latest;
  }, null);
}
