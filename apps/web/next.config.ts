import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: [
    "@lights-on/auth",
    "@lights-on/config",
    "@lights-on/database",
    "@lights-on/email",
    "@lights-on/payments",
    "@lights-on/product-analytics",
    "@lights-on/queue",
    "@lights-on/ui",
    "@lights-on/validation"
  ]
};

export default nextConfig;
