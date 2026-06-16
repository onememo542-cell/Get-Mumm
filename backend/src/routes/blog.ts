import { Router, type IRouter } from "express";
import { BlogService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { validateQuery, validateParams } from "../middlewares/validation";
import {
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  ListBlogPostsQueryParams,
} from "../api-zod";

const router: IRouter = Router();
const blogService = new BlogService();

/**
 * List blog posts with optional filtering by type and limit
 */
router.get(
  "/blog/posts",
  validateQuery(ListBlogPostsQueryParams),
  asyncHandler(async (req, res) => {
    const posts = await blogService.getBlogPosts(req.query as any);
    res.json(ListBlogPostsResponse.parse(posts));
  }),
);

/**
 * Get a single blog post by slug
 */
router.get(
  "/blog/posts/:slug",
  validateParams(GetBlogPostParams),
  asyncHandler(async (req, res) => {
    const { slug } = req.params as any;
    const post = await blogService.getBlogPostBySlug(slug);
    res.json(GetBlogPostResponse.parse(post));
  }),
);

export default router;
