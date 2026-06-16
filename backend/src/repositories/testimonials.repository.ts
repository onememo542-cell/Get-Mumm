/**
 * Testimonials Repository
 * Data access for testimonials
 */

import { eq } from "drizzle-orm";
import { db, testimonialsTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";
import { TestimonialFilters } from "../types";

export class TestimonialsRepository extends BaseRepository {
  /**
   * Get testimonials with optional filtering by type
   */
  async getTestimonials(filters: TestimonialFilters) {
    const { type } = filters;

    return this.findMany(
      () => {
        let query = db
          .select()
          .from(testimonialsTable)
          .orderBy(testimonialsTable.id);

        if (type != null) {
          query = query.where(eq(testimonialsTable.type, type));
        }

        return query;
      },
      async () => {
        let q: any = supabase
          .from("testimonials")
          .select("*")
          .order("id");

        if (type != null) {
          q = q.eq("type", type);
        }

        const { data } = await q;
        return data || [];
      },
    );
  }
}
