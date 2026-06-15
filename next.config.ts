import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server build at .next/standalone for Docker.
  output: "standalone",
};

export default nextConfig;
