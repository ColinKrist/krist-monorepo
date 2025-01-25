import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { tickets } from "./tickets";

export const bibs = sqliteTable("bibs", {
  id: int("id").primaryKey({ autoIncrement: true }),
  ticketId: int("ticket_id")
    .notNull()
    .references(() => tickets.id),
  bibNumber: text("bib_number").notNull().unique(),
  status: text("status").notNull().default("assigned"), // assigned, active, completed
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
