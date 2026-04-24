import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/generate", destination: "/api/generate" }];
  },
};

export default nextConfig;
