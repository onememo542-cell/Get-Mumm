import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const chefsTable = pgTable("chefs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  bio: text("bio").notNull(),
  bioAr: text("bio_ar").notNull(),
  imageUrl: text("image_url").notNull(),
  specialties: text("specialties").array().notNull().default([]),
  specialtiesAr: text("specialties_ar").array().notNull().default([]),
  itemCount: integer("item_count").notNull().default(0),
  rating: real("rating").notNull().default(4.8),
  joinedYear: integer("joined_year").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChefSchema = createInsertSchema(chefsTable).omit({ id: true, createdAt: true });
export type InsertChef = z.infer<typeof insertChefSchema>;
export type Chef = typeof chefsTable.$inferSelect;
