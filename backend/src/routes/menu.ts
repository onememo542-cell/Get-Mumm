import { Router, type IRouter } from "express";
import { eq, ilike, lte, and, type SQL } from "drizzle-orm";
import { db, categoriesTable, menuItemsTable } from "@workspace/db";
import {
  ListCategoriesResponse,
  ListMenuItemsResponse,
  GetFeaturedItemsResponse,
  GetMenuItemParams,
  GetMenuItemResponse,
  ListMenuItemsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/menu/categories", async (_req, res): Promise<void> => {
  const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  res.json(ListCategoriesResponse.parse(categories));
});

router.get("/menu/items/featured", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(menuItemsTable)
    .where(and(eq(menuItemsTable.isFeatured, true), eq(menuItemsTable.isAvailable, true)))
    .limit(8);
  res.json(GetFeaturedItemsResponse.parse(items));
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

  const items = await db
    .select()
    .from(menuItemsTable)
    .where(and(...conditions))
    .orderBy(menuItemsTable.name);

  res.json(ListMenuItemsResponse.parse(items));
});

router.get("/menu/items/:id", async (req, res): Promise<void> => {
  const params = GetMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db
    .select()
    .from(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id));

  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(GetMenuItemResponse.parse(item));
});

export default router;
