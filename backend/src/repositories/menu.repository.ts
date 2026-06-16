/**
 * Menu Repository
 * Data access for menu items and categories
 */

import { and, eq, ilike, lte } from "drizzle-orm";
import { db, categoriesTable, menuItemsTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";
import { MenuItemFilters } from "../types";

export class MenuRepository extends BaseRepository {
  /**
   * Get all categories ordered by name
   */
  async getCategories() {
    return this.findMany(
      () => db.select().from(categoriesTable).orderBy(categoriesTable.name),
      async () => {
        const { data } = await supabase
          .from("categories")
          .select("*")
          .order("name");
        return data || [];
      },
    );
  }

  /**
   * Get featured menu items (limit 8 by default)
   */
  async getFeaturedItems(limit: number = 8) {
    return this.findMany(
      () =>
        db
          .select()
          .from(menuItemsTable)
          .where(
            and(
              eq(menuItemsTable.isFeatured, true),
              eq(menuItemsTable.isAvailable, true),
            ),
          )
          .limit(limit),
      async () => {
        const { data } = await supabase
          .from("menu_items")
          .select("*")
          .eq("is_featured", true)
          .eq("is_available", true)
          .limit(limit)
          .order("name");
        return data || [];
      },
    );
  }

  /**
   * Get menu items with optional filters
   */
  async getMenuItems(filters: MenuItemFilters) {
    const { categoryId, maxPrice, search } = filters;

    const conditions = [eq(menuItemsTable.isAvailable, true)];
    if (categoryId != null) {
      conditions.push(eq(menuItemsTable.categoryId, categoryId));
    }
    if (maxPrice != null) {
      conditions.push(lte(menuItemsTable.price, maxPrice));
    }
    if (search != null && search.trim() !== "") {
      conditions.push(ilike(menuItemsTable.name, `%${search}%`));
    }

    return this.findMany(
      () =>
        db
          .select()
          .from(menuItemsTable)
          .where(and(...conditions))
          .orderBy(menuItemsTable.name),
      async () => {
        let q: any = supabase
          .from("menu_items")
          .select("*")
          .eq("is_available", true)
          .order("name");

        if (categoryId != null) q = q.eq("category_id", categoryId);
        if (maxPrice != null) q = q.lte("price", maxPrice);
        if (search != null && search.trim() !== "") {
          q = q.ilike("name", `%${search}%`);
        }

        const { data } = await q;
        return data || [];
      },
    );
  }

  /**
   * Get single menu item by ID
   */
  async getMenuItemById(id: number) {
    return this.findOne(
      async () => {
        const [result] = await db
          .select()
          .from(menuItemsTable)
          .where(eq(menuItemsTable.id, id));
        return result;
      },
      async () => {
        const { data } = await supabase
          .from("menu_items")
          .select("*")
          .eq("id", id)
          .single();
        return data || undefined;
      },
      "Menu item",
    );
  }
}
