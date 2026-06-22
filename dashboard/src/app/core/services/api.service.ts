import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CacheService } from './cache.service';
import {
  ListCategoriesResponse, ListMenuItemsResponse, GetMenuItemResponse,
  GetFeaturedItemsResponse, ListChefsResponse, GetChefResponse,
  OrderDto, OrderStatusDto,
  SubscriptionDto, CreateSubscriptionRequest, UpdateSubscriptionRequest,
  BlogPostDto, BlogPostsAdminResponse,
  TestimonialDto, StatsDto, HealthCheckResponse,
  ContactSubmissionDto, OfficeInquirySubmissionDto,
} from '../../models';

const TTL = {
  STABLE:   10 * 60 * 1000,  // 10 min
  MEDIUM:    5 * 60 * 1000,  // 5 min
  REALTIME:     30 * 1000,   // 30 sec
  HEALTH:       15 * 1000,   // 15 sec
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient, private cache: CacheService) {}

  /* ── Stats ── */
  getStats(): Observable<StatsDto> {
    return this.cache.wrap('stats', this.http.get<StatsDto>(`${this.base}/Stats`), TTL.REALTIME);
  }

  getHealth(): Observable<HealthCheckResponse> {
    return this.cache.wrap('health', this.http.get<HealthCheckResponse>(`${this.base}/Health`), TTL.HEALTH);
  }

  /* ── Menu ── */
  getCategories(): Observable<ListCategoriesResponse> {
    return this.cache.wrap('categories', this.http.get<ListCategoriesResponse>(`${this.base}/Menu/categories`), TTL.STABLE);
  }

  getMenuItems(page = 1, pageSize = 100, categoryId?: string, search?: string): Observable<ListMenuItemsResponse> {
    const key = `menu-items:${page}:${pageSize}:${categoryId ?? ''}:${search ?? ''}`;
    let params = new HttpParams().set('Page', page).set('PageSize', pageSize);
    if (categoryId) params = params.set('CategoryId', categoryId);
    if (search) params = params.set('Search', search);
    return this.cache.wrap(key, this.http.get<ListMenuItemsResponse>(`${this.base}/Menu/items`, { params }), TTL.MEDIUM);
  }

  getMenuItem(id: string): Observable<GetMenuItemResponse> {
    return this.cache.wrap(`menu-item:${id}`, this.http.get<GetMenuItemResponse>(`${this.base}/Menu/items/${id}`), TTL.MEDIUM);
  }

  getFeaturedItems(): Observable<GetFeaturedItemsResponse> {
    return this.cache.wrap('featured-items', this.http.get<GetFeaturedItemsResponse>(`${this.base}/Menu/items/featured`), TTL.MEDIUM);
  }

  /* ── Chefs ── */
  getChefs(): Observable<ListChefsResponse> {
    return this.cache.wrap('chefs', this.http.get<ListChefsResponse>(`${this.base}/Chefs`), TTL.STABLE);
  }

  getChef(id: string): Observable<GetChefResponse> {
    return this.cache.wrap(`chef:${id}`, this.http.get<GetChefResponse>(`${this.base}/Chefs/${id}`), TTL.STABLE);
  }

  /* ── Orders ── */
  getOrder(id: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.base}/orders/${id}`);
  }

  getOrderStatus(id: string): Observable<OrderStatusDto> {
    return this.http.get<OrderStatusDto>(`${this.base}/orders/${id}/status`);
  }

  /* ── Subscriptions ── */
  getSubscriptions(): Observable<SubscriptionDto[]> {
    return this.http.get<SubscriptionDto[]>(`${this.base}/Subscriptions`);
  }

  getSubscription(id: string): Observable<SubscriptionDto> {
    return this.http.get<SubscriptionDto>(`${this.base}/Subscriptions/${id}`);
  }

  createSubscription(req: CreateSubscriptionRequest): Observable<SubscriptionDto> {
    this.cache.invalidate('stats');
    return this.http.post<SubscriptionDto>(`${this.base}/Subscriptions`, req);
  }

  updateSubscription(id: string, req: UpdateSubscriptionRequest): Observable<SubscriptionDto> {
    return this.http.put<SubscriptionDto>(`${this.base}/Subscriptions/${id}`, req);
  }

  deleteSubscription(id: string): Observable<void> {
    this.cache.invalidate('stats');
    return this.http.delete<void>(`${this.base}/Subscriptions/${id}`);
  }

  /* ── Blog ── */
  getBlogPosts(): Observable<BlogPostDto[]> {
    return this.cache.wrap('blog-posts', this.http.get<BlogPostDto[]>(`${this.base}/Blog/posts`), TTL.STABLE);
  }

  getBlogPostsAdmin(page = 1, pageSize = 20): Observable<BlogPostsAdminResponse> {
    const key = `blog-admin:${page}:${pageSize}`;
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.cache.wrap(key, this.http.get<BlogPostsAdminResponse>(`${this.base}/Blog`, { params }), TTL.STABLE);
  }

  getBlogPostById(id: string): Observable<BlogPostDto> {
    return this.cache.wrap(`blog-post-id:${id}`, this.http.get<BlogPostDto>(`${this.base}/Blog/${id}`), TTL.STABLE);
  }

  /* ── Testimonials ── */
  getTestimonials(): Observable<TestimonialDto[]> {
    return this.cache.wrap('testimonials', this.http.get<TestimonialDto[]>(`${this.base}/Testimonials`), TTL.STABLE);
  }

  /* ── Contact Submissions ── */
  getContactSubmissions(): Observable<ContactSubmissionDto[]> {
    return this.http.get<ContactSubmissionDto[]>(`${this.base}/Contact`);
  }

  getOfficeInquiries(): Observable<OfficeInquirySubmissionDto[]> {
    return this.http.get<OfficeInquirySubmissionDto[]>(`${this.base}/Contact/office-inquiries`);
  }
}
