/**
 * Chefs Service
 * Business logic for chef profiles
 */

import { ChefsRepository } from "../repositories";

export class ChefsService {
  private chefsRepository: ChefsRepository;

  constructor() {
    this.chefsRepository = new ChefsRepository();
  }

  /**
   * Get all chefs
   */
  async getAllChefs() {
    return this.chefsRepository.getAllChefs();
  }

  /**
   * Get single chef by ID
   */
  async getChefById(id: number) {
    return this.chefsRepository.getChefById(id);
  }
}
