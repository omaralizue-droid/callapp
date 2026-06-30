import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 configuration for CLI commands (migrate, generate, introspect).
 * Runtime database connection is handled via @prisma/adapter-pg in lib/db.ts.
 *
 * DIRECT_URL: Direct/session connection (port 5432) — required for migrations
 *             because PgBouncer (transaction pooler) doesn't support DDL.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
