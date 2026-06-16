import { Router, type IRouter } from "express";
import { eq, ilike, lte, and, type SQL } from "drizzle-orm";
import { db, categoriesTable, menuItemsTable } from "../db";
import { supabase } from "../lib/supabase";
import {
  ListCategoriesResponse,
  ListMenuItemsResponse,
  GetFeaturedItemsResponse,
  GetMenuItemParams,
  GetMenuItemResponse,
  ListMenuItemsQueryParams,
} from "../api-zod";

const router: IRouter = Router();

router.get("/menu/categories", async (_req, res): Promise<void> => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
    res.json(ListCategoriesResponse.parse(categories));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) {
        console.error('Supabase categories error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListCategoriesResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Categories fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
});

router.get("/menu/items/featured", async (_req, res): Promise<void> => {
  try {
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(and(eq(menuItemsTable.isFeatured, true), eq(menuItemsTable.isAvailable, true)))
      .limit(8);
    res.json(GetFeaturedItemsResponse.parse(items));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_featured', true)
        .eq('is_available', true)
        .limit(8)
        .order('name');
      if (error) {
        console.error('Supabase featured items error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(GetFeaturedItemsResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Featured items fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch featured items' });
    }
  }
});

router.get("/menu/items", async (req, res): Promise<void> => {
  const parsed = ListMenuItemsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { categoryId, maxPrice, search } = parsed.data;

  const conditions: SQL[] = [eq(menuItemsTable.isAvailable, true)];

  if (categoryId != null) {
    conditions.push(eq(menuItemsTable.categoryId, categoryId));
  }
  if (maxPrice != null) {
    conditions.push(lte(menuItemsTable.price, maxPrice));
  }
  if (search != null && search.trim() !== "") {
    conditions.push(ilike(menuItemsTable.name, `%${search}%`));
  }

  try {
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(and(...conditions))
      .orderBy(menuItemsTable.name);
    res.json(ListMenuItemsResponse.parse(items));
    return;
  } catch (err) {
    // fallback to supabase
    try {
      let q: any = supabase.from('menu_items').select('*').eq('is_available', true).order('name');
      if (categoryId != null) q = q.eq('category_id', categoryId);
      if (maxPrice != null) q = q.lte('price', maxPrice);
      if (search != null && search.trim() !== '') q = q.ilike('name', `%${search}%`);
      const { data, error } = await q;
      if (error) {
        console.error('Supabase menu items error:', error.message);
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.json([]);
      return res.json(ListMenuItemsResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Menu items fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  }
});

router.get("/menu/items/:id", async (req, res): Promise<void> => {
  const params = GetMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [item] = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, params.data.id));

    if (!item) {
      res.status(404).json({ error: "Menu item not found" });
      return;
    }
    res.json(GetMenuItemResponse.parse(item));
    return;
  } catch (err) {
    // fallback to Supabase HTTP
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', params.data.id)
        .single();
      
      if (error || !data) {
        console.error('Menu item not found:', error?.message);
        return res.status(404).json({ error: "Menu item not found" });
      }
      return res.json(GetMenuItemResponse.parse(data));
    } catch (fallbackErr) {
      console.error('Single menu item fallback failed:', fallbackErr);
      return res.status(500).json({ error: 'Failed to fetch menu item' });
    }
  }
});

export default router;
