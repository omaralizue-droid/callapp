import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle these native/Node-only packages into serverless functions.
  // They are resolved at runtime from node_modules on the server.
  serverExternalPackages: [
    'pg',
    'pg-native',
    'better-sqlite3',
    '@prisma/adapter-pg',
    '@prisma/adapter-better-sqlite3',
    '@prisma/client',
    'prisma',
  ],
};

export default nextConfig;
