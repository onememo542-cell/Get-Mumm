/**
 * Chefs Repository
 * Data access for chef profiles
 */

import { eq } from "drizzle-orm";
import { db, chefsTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";

export class ChefsRepository extends BaseRepository {
  /**
   * Get all chefs ordered by rating
   */
  async getAllChefs() {
    return this.findMany(
      () => db.select().from(chefsTable).orderBy(chefsTable.rating),
      async () => {
        const { data } = await supabase
          .from("chefs")
          .select("*")
          .order("rating", { ascending: true });
        return data || [];
      },
    );
  }

  /**
   * Get single chef by ID
   */
  async getChefById(id: string) {
    return this.findOne(
      async () => {
        const [result] = await db
          .select()
          .from(chefsTable)
          .where(eq(chefsTable.id, id));
        return result;
      },
      async () => {
        const { data } = await supabase
          .from("chefs")
          .select("*")
          .eq("id", id)
          .single();
        return data || undefined;
      },
      "Chef",
    );
  }
}
