import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  quote: text("quote").notNull(),
  quoteAr: text("quote_ar").notNull(),
  type: text("type").notNull().default("customer"),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url").notNull(),
  company: text("company"),
  companyAr: text("company_ar"),
  role: text("role"),
  roleAr: text("role_ar"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonialsTable).omit({ id: true, createdAt: true });
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;
