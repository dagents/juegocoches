import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use DIRECT_URL for CLI operations (migrations, db push) — bypasses connection pooler
    url: process.env.DIRECT_URL ?? "",
  },
});
