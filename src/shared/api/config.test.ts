import { afterEach, describe, expect, it, vi } from "vitest";

import { getApiBaseUrl, getModuleBaseUrl } from "@/shared/api/config";

describe("api config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers OPENAPI_BASE_URL for server-side module URLs", () => {
    vi.stubEnv("OPENAPI_BASE_URL", "http://127.0.0.1:3099");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://saba.gold");

    expect(getApiBaseUrl()).toBe("http://127.0.0.1:3099");
    expect(getModuleBaseUrl("identity")).toBe("http://127.0.0.1:3099/api/identity/v1");
  });

  it("falls back to the staging default when no API URL is configured", () => {
    expect(getApiBaseUrl()).toBe("https://saba.gold");
  });
});
