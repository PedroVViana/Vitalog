import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore - experimental property
  experimental: {
    turbopack: {
      root: '.',
    },
  },
};

export default nextConfig;
