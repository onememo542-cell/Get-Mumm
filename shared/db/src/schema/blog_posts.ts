import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  excerptAr: text("excerpt_ar").notNull(),
  content: text("content").notNull(),
  contentAr: text("content_ar").notNull(),
  imageUrl: text("image_url").notNull(),
  type: text("type").notNull().default("blog"),
  publishedAt: text("published_at").notNull(),
  author: text("author").notNull(),
  authorAr: text("author_ar").notNull(),
  readTimeMinutes: integer("read_time_minutes").notNull().default(5),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({ id: true, createdAt: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
