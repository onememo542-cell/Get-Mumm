import { Router, type IRouter } from "express";
import { eq, desc, type SQL } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  ListBlogPostsQueryParams,
} from "@workspace/api-zod";

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
});

router.get("/blog/posts/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(GetBlogPostResponse.parse(post));
});

export default router;
