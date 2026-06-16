/**
 * Subscriptions Service
 * Business logic for subscription plans
 */

import { SubscriptionsRepository } from "../repositories";

export class SubscriptionsService {
  private subscriptionsRepository: SubscriptionsRepository;

  constructor() {
    this.subscriptionsRepository = new SubscriptionsRepository();
  }

  /**
   * Get all subscription plans
   */
  async getSubscriptionPlans() {
    return this.subscriptionsRepository.getSubscriptionPlans();
  }
}
