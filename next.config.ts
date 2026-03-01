import type { NextConfig } from "next";

/**
 * Next.js 16 config for Azure Web App (Linux).
 * - output: "standalone" → .next/standalone + server.js for Node (no full node_modules on server).
 * - serverExternalPackages: Prisma must be external so the standalone trace includes it.
 */
const nextConfig: NextConfig = {
  output: "standalone",

  serverExternalPackages: [
    "@prisma/client",
    "@prisma/client-runtime-utils",
    "@prisma/adapter-pg",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
