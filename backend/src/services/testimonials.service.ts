/**
 * Testimonials Service
 * Business logic for testimonials
 */

import { TestimonialsRepository } from "../repositories";
import { TestimonialFilters } from "../types";

export class TestimonialsService {
  private testimonialsRepository: TestimonialsRepository;

  constructor() {
    this.testimonialsRepository = new TestimonialsRepository();
  }

  /**
   * Get testimonials with optional filtering
   */
  async getTestimonials(filters: TestimonialFilters) {
    return this.testimonialsRepository.getTestimonials(filters);
  }
}
