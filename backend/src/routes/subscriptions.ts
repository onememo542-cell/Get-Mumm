import { Router, type IRouter } from "express";
import { db, subscriptionPlansTable } from "@workspace/db";
import { ListSubscriptionPlansResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/subscriptions", async (_req, res): Promise<void> => {
  const plans = await db
    .select()
    .from(subscriptionPlansTable)
    .orderBy(subscriptionPlansTable.price);
  res.json(ListSubscriptionPlansResponse.parse(plans));
});

export default router;
