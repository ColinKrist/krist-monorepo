import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { races } from "./races";
import { users } from "./users";

export const tickets = sqliteTable("tickets", {
  id: int("id").primaryKey({ autoIncrement: true }),
  raceId: int("race_id")
    .notNull()
    .references(() => races.id),
  userId: int("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, refunded
  purchaseDate: text("purchase_date")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  price: real("price").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
