import { customFetch } from "./client";
import type {
  BlogPost,
  Category,
  Chef,
  ContactInput,
  ContactResponse,
  CreateOrderRequest,
  HealthStatus,
  ListBlogPostsParams,
  ListMenuItemsParams,
  ListTestimonialsParams,
  MenuItem,
  OfficeInquiryInput,
  OrderResponse,
  OrderStatusResponse,
  SiteSummary,
  SubscriptionPlan,
  Testimonial,
} from "./types";

export const endpoints = {
  // Health
  healthCheck: () => customFetch<HealthStatus>("/api/health", { method: "GET" }),

  // Site Stats
  getSiteSummary: () => customFetch<SiteSummary>("/api/stats", { method: "GET" }),

  // Subscriptions
  listSubscriptionPlans: () => customFetch<SubscriptionPlan[]>("/api/subscriptions", { method: "GET" }),

  // Menu Categories
  listCategories: () => customFetch<Category[]>("/api/menu/categories", { method: "GET" }),

  // Menu Items
  listMenuItems: (params?: ListMenuItemsParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return customFetch<MenuItem[]>(`/api/menu/items${query}`, { method: "GET" });
  },

  getFeaturedItems: () => customFetch<MenuItem[]>("/api/menu/items/featured", { method: "GET" }),

  getMenuItem: (id: string | number) => customFetch<MenuItem>(`/api/menu/items/${id}`, { method: "GET" }),

  // Chefs
  listChefs: () => customFetch<Chef[]>("/api/chefs", { method: "GET" }),

  getChef: (id: string | number) => customFetch<Chef>(`/api/chefs/${id}`, { method: "GET" }),

  // Blog
  listBlogPosts: (params?: ListBlogPostsParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return customFetch<BlogPost[]>(`/api/blog/posts${query}`, { method: "GET" });
  },

  getBlogPost: (slug: string) => customFetch<BlogPost>(`/api/blog/posts/${slug}`, { method: "GET" }),

  // Testimonials
  listTestimonials: (params?: ListTestimonialsParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return customFetch<Testimonial[]>(`/api/testimonials${query}`, { method: "GET" });
  },

  // Orders
  createOrder: (data: CreateOrderRequest) =>
    customFetch<OrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOrder: (id: string) =>
    customFetch<OrderResponse>(`/api/orders/${id}`, { method: "GET" }),

  getOrderStatus: (id: string) =>
    customFetch<OrderStatusResponse>(`/api/orders/${id}/status`, { method: "GET" }),

  // Forms
  submitContact: (data: ContactInput) =>
    customFetch<ContactResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitOfficeInquiry: (data: OfficeInquiryInput) =>
    customFetch<ContactResponse>("/api/contact/office-inquiry", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
