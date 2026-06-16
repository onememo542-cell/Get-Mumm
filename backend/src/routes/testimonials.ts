import { Router, type IRouter } from "express";
import { eq, type SQL } from "drizzle-orm";
import { db, testimonialsTable } from "../db";
import { supabase } from "../lib/supabase";
import {
  ListTestimonialsResponse,
  ListTestimonialsQueryParams,
} from "../api-zod";

const router: IRouter = Router();

router.get("/testimonials", async (req, res): Promise<void> => {
  const parsed = ListTestimonialsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { type } = parsed.data;

  const conditions: SQL[] = [];
  if (type != null) {
    conditions.push(eq(testimonialsTable.type, type));
  }

  try {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .where(conditions.length > 0 ? conditions[0] : undefined)
      .orderBy(testimonialsTable.id);

    res.json(ListTestimonialsResponse.parse(testimonials));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      let q: any = supabase.from('testimonials').select('*').order('id');
      if (type != null) q = q.eq('type', type);
      
      const { data, error } = await q;
      if (error) {
        console.error('Supabase testimonials error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListTestimonialsResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Testimonials fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }
});

export default router;
