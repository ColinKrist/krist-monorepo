import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { bibs } from "./bibs";

export const photos = sqliteTable("photos", {
  id: int("id").primaryKey({ autoIncrement: true }),
  bibId: int("bib_id")
    .notNull()
    .references(() => bibs.id),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  takenAt: text("taken_at"),
  photographer: text("photographer"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
