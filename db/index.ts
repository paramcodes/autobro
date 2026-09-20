import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Pooled connection for app runtime (hostname contains `-pooler`).
// Migrations / Drizzle Kit use DATABASE_URL_UNPOOLED (direct) instead.
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql);
