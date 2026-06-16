import { Router, type IRouter } from "express";
import { eq, desc, type SQL } from "drizzle-orm";
import { db, blogPostsTable } from "../db";
import { supabase } from "../lib/supabase";
import {
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  ListBlogPostsQueryParams,
} from "../api-zod";

const router: IRouter = Router();

router.get("/blog/posts", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { type, limit } = parsed.data;

  const conditions: SQL[] = [];
  if (type != null) {
    conditions.push(eq(blogPostsTable.type, type));
  }

  try {
    let query = db
      .select()
      .from(blogPostsTable)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(desc(blogPostsTable.publishedAt));

    if (limit != null) {
      const posts = await query.limit(limit);
      res.json(ListBlogPostsResponse.parse(posts));
      return;
    }

    const posts = await query;
    res.json(ListBlogPostsResponse.parse(posts));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      let q: any = supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (type != null) q = q.eq('type', type);
      if (limit != null) q = q.limit(limit);
      
      const { data, error } = await q;
      if (error) {
        console.error('Supabase blog posts error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListBlogPostsResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Blog posts fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  }
});

router.get("/blog/posts/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [post] = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.slug, params.data.slug));

    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(GetBlogPostResponse.parse(post));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.data.slug)
        .single();

      if (error || !data) {
        console.error('Blog post not found:', error?.message);
        return res.status(404).json({ error: "Blog post not found" });
      }
      return res.json(GetBlogPostResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Single blog post fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  }
});

export default router;
