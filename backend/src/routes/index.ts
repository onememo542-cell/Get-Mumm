import { Router, type IRouter } from "express";
import healthRouter from "./health";
import menuRouter from "./menu";
import chefsRouter from "./chefs";
import blogRouter from "./blog";
import testimonialsRouter from "./testimonials";
import subscriptionsRouter from "./subscriptions";
import contactRouter from "./contact";
import statsRouter from "./stats";
import mcpRouter from "./mcp";
import { BlogService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";

const router: IRouter = Router();
const blogService = new BlogService();

// Root API info endpoint
router.get("/", (_req, res) => {
  res.json({
    message: "Get Mumm API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/healthz",
      menu: {
        categories: "GET /api/menu/categories",
        items: "GET /api/menu/items",
        featured: "GET /api/menu/items/featured",
        item: "GET /api/menu/items/:id",
      },
      chefs: {
        list: "GET /api/chefs",
        single: "GET /api/chefs/:id",
      },
      blog: {
        posts: "GET /api/blog/posts",
        post: "GET /api/blog/posts/:slug",
      },
      testimonials: "GET /api/testimonials",
      subscriptions: "GET /api/subscriptions",
      contact: "POST /api/contact",
      officeInquiry: "POST /api/office-inquiry",
      stats: "GET /api/stats/summary",
    },
  });
});

// Compatibility endpoint for /api/blog (redirects to /api/blog/posts)
router.get(
  "/blog",
  asyncHandler(async (req, res) => {
    const posts = await blogService.getBlogPosts({});
    res.json({
      items: posts,
      data: posts,
      posts: posts,
    });
  }),
);

router.use(healthRouter);
router.use(menuRouter);
router.use(chefsRouter);
router.use(blogRouter);
router.use(testimonialsRouter);
router.use(subscriptionsRouter);
router.use(contactRouter);
router.use(statsRouter);
router.use(mcpRouter);

export default router;

