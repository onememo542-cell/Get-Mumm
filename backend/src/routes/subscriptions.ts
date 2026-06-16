import { Router, type IRouter } from "express";
import { db, subscriptionPlansTable } from "../db";
import { ListSubscriptionPlansResponse } from "../api-zod";

const router: IRouter = Router();

router.get("/subscriptions", async (_req, res): Promise<void> => {
  const plans = await db
    .select()
    .from(subscriptionPlansTable)
    .orderBy(subscriptionPlansTable.price);
  res.json(ListSubscriptionPlansResponse.parse(plans));
});

export default router;
