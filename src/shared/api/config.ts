export type ApiModuleName =
  | "identity"
  | "asset"
  | "wallet"
  | "pricing"
  | "quote"
  | "trading"
  | "settlement"
  | "payments"
  | "delivery"
  | "admin"
  | "audit"
  | "compliance"
  | "reconciliation"
  | "ledger"
  | "notification"
  | "liquidity";

/** Shared staging API for frontend development and contract sync. */
const DEFAULT_API_BASE_URL = "https://saba.gold";

function readConfiguredApiBaseUrl(): string | undefined {
  if (typeof window === "undefined") {
    return process.env.OPENAPI_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export function getApiBaseUrl(): string {
  const configured = readConfiguredApiBaseUrl()?.trim();

  if (!configured) {
    return DEFAULT_API_BASE_URL;
  }

  return configured.replace(/\/$/, "");
}

export function getModulePathPrefix(moduleName: ApiModuleName): string {
  return `/api/${moduleName}/v1`;
}

export function getModuleBaseUrl(moduleName: ApiModuleName): string {
  return `${getApiBaseUrl()}${getModulePathPrefix(moduleName)}`;
}
