/**
 * Blog Repository
 * Data access for blog posts
 */

import { desc, eq } from "drizzle-orm";
import { db, blogPostsTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";
import { BlogPostFilters } from "../types";

export class BlogRepository extends BaseRepository {
  /**
   * Get blog posts with optional filtering
   */
  async getBlogPosts(filters: BlogPostFilters) {
    const { type, limit } = filters;

    return this.findMany(
      () => {
        let query = db
          .select()
          .from(blogPostsTable)
          .orderBy(desc(blogPostsTable.publishedAt));

        if (type != null) {
          query = query.where(eq(blogPostsTable.type, type));
        }

        if (limit != null) {
          query = query.limit(limit);
        }

        return query;
      },
      async () => {
        let q: any = supabase
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false });

        if (type != null) q = q.eq("type", type);
        if (limit != null) q = q.limit(limit);

        const { data } = await q;
        return data || [];
      },
    );
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPostBySlug(slug: string) {
    return this.findOne(
      async () => {
        const [result] = await db
          .select()
          .from(blogPostsTable)
          .where(eq(blogPostsTable.slug, slug));
        return result;
      },
      async () => {
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();
        return data || undefined;
      },
      "Blog post",
    );
  }
}
