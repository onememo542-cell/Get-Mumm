/**
 * Menu Service
 * Business logic for menu items and categories
 */

import { MenuRepository } from "../repositories";
import { MenuItemFilters } from "../types";

export class MenuService {
  private menuRepository: MenuRepository;

  constructor() {
    this.menuRepository = new MenuRepository();
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return this.menuRepository.getCategories();
  }

  /**
   * Get featured menu items
   */
  async getFeaturedItems(limit?: number) {
    return this.menuRepository.getFeaturedItems(limit);
  }

  /**
   * Get menu items with filters
   */
  async getMenuItems(filters: MenuItemFilters) {
    return this.menuRepository.getMenuItems(filters);
  }

  /**
   * Get single menu item
   */
  async getMenuItemById(id: string) {
    return this.menuRepository.getMenuItemById(id);
  }
}
