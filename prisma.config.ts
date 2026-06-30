import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    adapter: async () => {
      const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
      return new PrismaPg({ connectionString });
    },
  },
});