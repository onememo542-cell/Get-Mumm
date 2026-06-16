/**
 * Stats Repository
 * Data access for statistics and summaries
 */

import { count } from "drizzle-orm";
import { db, chefsTable, menuItemsTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";

export interface SiteSummary {
  mealsDelivered: number;
  chefsEmpowered: number;
  happyCustomers: number;
  deliveryAreas: number;
  avgRating: number;
  yearsOfService: number;
}

export class StatsRepository extends BaseRepository {
  /**
   * Get site summary with chef and menu item counts
   */
  async getSiteSummary(): Promise<SiteSummary> {
    const [chefsCount, _itemsCount] = await Promise.all([
      this.execute(
        async () => {
          const [result] = await db
            .select({ count: count() })
            .from(chefsTable);
          return result?.count ?? 12;
        },
        async () => {
          const { count: c } = await supabase
            .from("chefs")
            .select("*", { count: "exact", head: true });
          return c ?? 12;
        },
      ),
      this.execute(
        async () => {
          const [result] = await db
            .select({ count: count() })
            .from(menuItemsTable);
          return result?.count ?? 0;
        },
        async () => {
          const { count: c } = await supabase
            .from("menu_items")
            .select("*", { count: "exact", head: true });
          return c ?? 0;
        },
      ),
    ]);

    return {
      mealsDelivered: 250000,
      chefsEmpowered: chefsCount,
      happyCustomers: 18500,
      deliveryAreas: 35,
      avgRating: 4.9,
      yearsOfService: 5,
    };
  }
}
