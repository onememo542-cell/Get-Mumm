/**
 * Stats Service
 * Business logic for statistics
 */

import { StatsRepository } from "../repositories";

export class StatsService {
  private statsRepository: StatsRepository;

  constructor() {
    this.statsRepository = new StatsRepository();
  }

  /**
   * Get site summary
   */
  async getSiteSummary() {
    return this.statsRepository.getSiteSummary();
  }
}
