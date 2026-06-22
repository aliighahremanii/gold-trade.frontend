import createClient, { type Client, type ClientOptions } from "openapi-fetch";

import { getModuleBaseUrl, type ApiModuleName } from "./config";

export type ModuleClient<Paths extends object> = Client<Paths, `${string}/${string}`>;

function resolveModuleBaseUrl(moduleName: ApiModuleName) {
  if (typeof window !== "undefined") {
    return `/api/proxy/${moduleName}`;
  }

  return getModuleBaseUrl(moduleName);
}

export function createModuleClient<Paths extends object>(
  moduleName: ApiModuleName,
  options: Omit<ClientOptions, "baseUrl"> & { baseUrl?: string } = {},
): ModuleClient<Paths> {
  const { baseUrl: baseUrlOverride, ...rest } = options;

  return createClient<Paths>({
    ...rest,
    baseUrl: baseUrlOverride ?? resolveModuleBaseUrl(moduleName),
    credentials: rest.credentials ?? "include",
  });
}
