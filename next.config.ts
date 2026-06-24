import type { NextConfig } from "next";

import {
  getBaselineSecurityResponseHeaders,
  isProductionSecurityProfile,
} from "./src/shared/config/security-headers";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server build at .next/standalone for Docker.
  output: "standalone",
  async headers() {
    // Skip baked headers in local/E2E dev profile; production builds always apply baseline headers.
    if (!isProductionSecurityProfile()) {
      return [];
    }

    // Baseline headers are baked for all routes (including static assets the proxy skips).
    // CSP is applied at request time in src/proxy.ts so env/profile can vary without rebuilds.
    return [
      {
        source: "/(.*)",
        headers: getBaselineSecurityResponseHeaders(),
      },
    ];
  },
};

export default nextConfig;
