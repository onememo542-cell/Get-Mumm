import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, chefsTable } from "../db";
import { supabase } from "../lib/supabase";
import {
  ListChefsResponse,
  GetChefParams,
  GetChefResponse,
} from "../api-zod";

const router: IRouter = Router();

router.get("/chefs", async (_req, res): Promise<void> => {
  try {
    const chefs = await db.select().from(chefsTable).orderBy(chefsTable.rating);
    res.json(ListChefsResponse.parse(chefs));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .order('rating', { ascending: true });
      if (error) {
        console.error('Supabase chefs error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListChefsResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Chefs fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch chefs' });
    }
  }
});

router.get("/chefs/:id", async (req, res): Promise<void> => {
  const params = GetChefParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [chef] = await db
      .select()
      .from(chefsTable)
      .where(eq(chefsTable.id, params.data.id));

    if (!chef) {
      res.status(404).json({ error: "Chef not found" });
      return;
    }
    res.json(GetChefResponse.parse(chef));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .eq('id', params.data.id)
        .single();
      
      if (error || !data) {
        console.error('Chef not found:', error?.message);
        return res.status(404).json({ error: "Chef not found" });
      }
      return res.json(GetChefResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Single chef fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch chef' });
    }
  }
});

export default router;
