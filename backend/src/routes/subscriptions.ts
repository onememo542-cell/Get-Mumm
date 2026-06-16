import { Router, type IRouter } from "express";
import { db, subscriptionPlansTable } from "../db";
import { supabase } from "../lib/supabase";
import { ListSubscriptionPlansResponse } from "../api-zod";

const router: IRouter = Router();

router.get("/subscriptions", async (_req, res): Promise<void> => {
  try {
    const plans = await db
      .select()
      .from(subscriptionPlansTable)
      .orderBy(subscriptionPlansTable.price);
    res.json(ListSubscriptionPlansResponse.parse(plans));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');
      if (error) {
        console.error('Supabase subscription plans error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListSubscriptionPlansResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Subscription plans fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch subscription plans' });
    }
  }
});

export default router;
