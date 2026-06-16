/**
 * Shared application types derived from API query schemas
 */

import type { z } from "zod";
import type {
  ListMenuItemsQueryParams,
  ListBlogPostsQueryParams,
  ListTestimonialsQueryParams,
} from "../api-zod";

export type MenuItemFilters = z.infer<typeof ListMenuItemsQueryParams>;
export type BlogPostFilters = z.infer<typeof ListBlogPostsQueryParams>;
export type TestimonialFilters = z.infer<typeof ListTestimonialsQueryParams>;
