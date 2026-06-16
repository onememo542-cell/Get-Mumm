import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { db, chefsTable, menuItemsTable } from "@workspace/db";
import { GetSiteSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [chefsCount] = await db.select({ count: count() }).from(chefsTable);
  const [itemsCount] = await db.select({ count: count() }).from(menuItemsTable);

  const summary = {
    mealsDelivered: 250000,
    chefsEmpowered: chefsCount?.count ?? 12,
    happyCustomers: 18500,
    deliveryAreas: 35,
    avgRating: 4.9,
    yearsOfService: 5,
  };

  res.json(GetSiteSummaryResponse.parse(summary));
});

export default router;
