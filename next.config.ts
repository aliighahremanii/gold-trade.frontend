import type { NextConfig } from "next";

import { getSecurityResponseHeaders } from "./src/shared/config/security-headers";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server build at .next/standalone for Docker.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: getSecurityResponseHeaders(),
      },
    ];
  },
};

export default nextConfig;
