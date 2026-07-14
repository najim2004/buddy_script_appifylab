import type { NextConfig } from "next";

/** Backend origin for Next.js rewrites (server-only). */
const backendUrl =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:4000";

const parsedBackendUrl = new URL(backendUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: parsedBackendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: parsedBackendUrl.hostname,
        port: parsedBackendUrl.port || undefined,
        pathname: "/public/storage/**",
      },
    ],
  },
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
