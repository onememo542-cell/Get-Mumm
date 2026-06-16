import { Router, type IRouter } from "express";
import { count } from "drizzle-orm";
import { db, chefsTable, menuItemsTable } from "../db";
import { supabase } from "../lib/supabase";
import { GetSiteSummaryResponse } from "../api-zod";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  try {
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
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { count: chefsCount, error: chefsError } = await supabase
        .from('chefs')
        .select('*', { count: 'exact', head: true });
      
      const { count: itemsCount, error: itemsError } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true });

      const summary = {
        mealsDelivered: 250000,
        chefsEmpowered: chefsCount ?? 12,
        happyCustomers: 18500,
        deliveryAreas: 35,
        avgRating: 4.9,
        yearsOfService: 5,
      };

      res.json(GetSiteSummaryResponse.parse(summary));
      return;
    } catch (fallbackErr) {
      console.error('Stats summary fallback failed:', fallbackErr);
      // return default summary values if everything fails
      const summary = {
        mealsDelivered: 250000,
        chefsEmpowered: 12,
        happyCustomers: 18500,
        deliveryAreas: 35,
        avgRating: 4.9,
        yearsOfService: 5,
      };
      res.json(GetSiteSummaryResponse.parse(summary));
      return;
    }
  }
});

export default router;
