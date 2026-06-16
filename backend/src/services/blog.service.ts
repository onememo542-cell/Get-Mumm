/**
 * Blog Service
 * Business logic for blog posts
 */

import { BlogRepository } from "../repositories";
import { BlogPostFilters } from "../types";

export class BlogService {
  private blogRepository: BlogRepository;

  constructor() {
    this.blogRepository = new BlogRepository();
  }

  /**
   * Get blog posts with optional filtering
   */
  async getBlogPosts(filters: BlogPostFilters) {
    return this.blogRepository.getBlogPosts(filters);
  }

  /**
   * Get single blog post by slug
   */
  async getBlogPostBySlug(slug: string) {
    return this.blogRepository.getBlogPostBySlug(slug);
  }
}
