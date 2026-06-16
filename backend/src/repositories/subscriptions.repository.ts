/**
 * Subscriptions Repository
 * Data access for subscription plans
 */

import { db, subscriptionPlansTable } from "../db";
import { supabase } from "../lib/supabase";
import { BaseRepository } from "./base.repository";

export class SubscriptionsRepository extends BaseRepository {
  /**
   * Get all subscription plans ordered by price
   */
  async getSubscriptionPlans() {
    return this.findMany(
      () =>
        db
          .select()
          .from(subscriptionPlansTable)
          .orderBy(subscriptionPlansTable.price),
      async () => {
        const { data } = await supabase
          .from("subscription_plans")
          .select("*")
          .order("price");
        return data || [];
      },
    );
  }
}
