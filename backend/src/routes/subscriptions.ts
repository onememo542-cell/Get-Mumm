import { Router, type IRouter } from "express";
import { SubscriptionsService } from "../services";
import { asyncHandler } from "../middlewares/async-handler";
import { ListSubscriptionPlansResponse } from "../api-zod";

const router: IRouter = Router();
const subscriptionsService = new SubscriptionsService();

/**
 * List all subscription plans ordered by price
 */
router.get(
  "/subscriptions",
  asyncHandler(async (_req, res) => {
    const plans = await subscriptionsService.getSubscriptionPlans();
    res.json(ListSubscriptionPlansResponse.parse(plans));
  }),
);

export default router;
