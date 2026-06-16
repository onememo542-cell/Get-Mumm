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

const router: IRouter = Router();

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
