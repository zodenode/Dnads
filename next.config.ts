import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/generate", destination: "/api/generate" }];
  },
};

export default nextConfig;
