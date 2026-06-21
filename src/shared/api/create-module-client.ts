import createClient, { type Client, type ClientOptions } from "openapi-fetch";

import { getModuleBaseUrl, type ApiModuleName } from "./config";

export type ModuleClient<Paths extends object> = Client<Paths, `${string}/${string}`>;

export function createModuleClient<Paths extends object>(
  moduleName: ApiModuleName,
  options: Omit<ClientOptions, "baseUrl"> = {},
): ModuleClient<Paths> {
  return createClient<Paths>({
    ...options,
    baseUrl: getModuleBaseUrl(moduleName),
    credentials: options.credentials ?? "include",
  });
}
