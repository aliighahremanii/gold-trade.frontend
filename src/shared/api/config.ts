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
  | "ledger";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

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
