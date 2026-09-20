// Drizzle schema for Lakebase Postgres (Neon).
// Add tables here. Drizzle Kit generates SQL migrations from this file
// (`bun run db:generate`) and applies them with the direct connection
// (`bun run db:migrate`). See https://neon.com/docs/guides/drizzle

import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const workflows = pgTable("workflows", {
  id: uuid("id").primaryKey().defaultRandom(),
  orgId: text("org_id").notNull(),
  name: text("name").notNull(),
  graph: jsonb("graph"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Workflow = typeof workflows.$inferSelect;
