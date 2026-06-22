import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ListCategoriesResponse, ListMenuItemsResponse, GetMenuItemResponse,
  GetFeaturedItemsResponse, ListChefsResponse, GetChefResponse,
  MenuItemDto, OrderDto, OrderStatusDto,
  SubscriptionDto, CreateSubscriptionRequest, UpdateSubscriptionRequest,
  BlogPostDto, TestimonialDto, StatsDto, HealthCheckResponse
} from '../../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api';

  constructor(private http: HttpClient) {}

  /* ── Stats ── */
  getStats(): Observable<StatsDto> {
    return this.http.get<StatsDto>(`${this.base}/Stats`);
  }

  getHealth(): Observable<HealthCheckResponse> {
    return this.http.get<HealthCheckResponse>(`${this.base}/Health`);
  }

  /* ── Menu ── */
  getCategories(): Observable<ListCategoriesResponse> {
    return this.http.get<ListCategoriesResponse>(`${this.base}/Menu/categories`);
  }

  getMenuItems(page = 1, pageSize = 20, categoryId?: string, search?: string): Observable<ListMenuItemsResponse> {
    let params = new HttpParams().set('Page', page).set('PageSize', pageSize);
    if (categoryId) params = params.set('CategoryId', categoryId);
    if (search) params = params.set('Search', search);
    return this.http.get<ListMenuItemsResponse>(`${this.base}/Menu/items`, { params });
  }

  getMenuItem(id: string): Observable<GetMenuItemResponse> {
    return this.http.get<GetMenuItemResponse>(`${this.base}/Menu/items/${id}`);
  }

  getFeaturedItems(): Observable<GetFeaturedItemsResponse> {
    return this.http.get<GetFeaturedItemsResponse>(`${this.base}/Menu/items/featured`);
  }

  /* ── Chefs ── */
  getChefs(): Observable<ListChefsResponse> {
    return this.http.get<ListChefsResponse>(`${this.base}/Chefs`);
  }

  getChef(id: string): Observable<GetChefResponse> {
    return this.http.get<GetChefResponse>(`${this.base}/Chefs/${id}`);
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
    return this.http.post<SubscriptionDto>(`${this.base}/Subscriptions`, req);
  }

  updateSubscription(id: string, req: UpdateSubscriptionRequest): Observable<SubscriptionDto> {
    return this.http.put<SubscriptionDto>(`${this.base}/Subscriptions/${id}`, req);
  }

  deleteSubscription(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/Subscriptions/${id}`);
  }

  /* ── Blog ── */
  getBlogPosts(): Observable<BlogPostDto[]> {
    return this.http.get<BlogPostDto[]>(`${this.base}/Blog/posts`);
  }

  getBlogPost(slug: string): Observable<BlogPostDto> {
    return this.http.get<BlogPostDto>(`${this.base}/Blog/posts/${slug}`);
  }

  /* ── Testimonials ── */
  getTestimonials(): Observable<TestimonialDto[]> {
    return this.http.get<TestimonialDto[]>(`${this.base}/Testimonials`);
  }
}
