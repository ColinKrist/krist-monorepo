import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const races = sqliteTable("races", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  location: text("location").notNull(),
  distance: real("distance").notNull(), // in kilometers
  elevationGain: real("elevation_gain"), // in meters
  maxParticipants: int("max_participants"),
  price: real("price").notNull(),
  status: text("status").notNull().default("draft"), // draft, published, completed, cancelled
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
