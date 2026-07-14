import type { NextConfig } from "next";

/** Backend origin for Next.js rewrites (server-only). */
const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/storage/:path*",
        destination: `${backendUrl}/public/storage/:path*`,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
