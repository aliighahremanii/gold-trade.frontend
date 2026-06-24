import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildContentSecurityPolicy,
  buildDevelopmentContentSecurityPolicy,
  buildProductionContentSecurityPolicy,
  getSecurityResponseHeaders,
  isProductionSecurityProfile,
} from "@/shared/config/security-headers";

describe("security headers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses a hardened production CSP without script eval allowances", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://saba.gold");

    const policy = buildProductionContentSecurityPolicy();

    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toMatch(/script-src[^;]*unsafe-eval/);
    expect(policy).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(policy).toContain("connect-src 'self' https://saba.gold");
    expect(policy).not.toContain("http://localhost");
  });

  it("keeps local development allowances separate from production", () => {
    vi.stubEnv("NODE_ENV", "development");

    const policy = buildDevelopmentContentSecurityPolicy();

    expect(policy).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(policy).toContain("http://localhost:*");
    expect(policy).toContain("ws://localhost:*");
  });

  it("selects the CSP profile from NODE_ENV", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");

    expect(isProductionSecurityProfile()).toBe(true);
    expect(buildContentSecurityPolicy()).toBe(buildProductionContentSecurityPolicy());
  });

  it("returns baseline browser security headers with CSP", () => {
    const headerNames = getSecurityResponseHeaders().map((header) => header.key);

    expect(headerNames).toContain("Content-Security-Policy");
    expect(headerNames).toContain("X-Content-Type-Options");
    expect(headerNames).toContain("Referrer-Policy");
    expect(headerNames).toContain("Permissions-Policy");
  });
});
