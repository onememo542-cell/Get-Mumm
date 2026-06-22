export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  itemCount: number;
}

export interface MenuItemDto {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  categoryId: string;
  categoryName: string;
  categoryNameAr: string;
  chefId: string;
  chefName: string;
  chefNameAr: string;
  imageUrl: string;
  dietary: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  prepTimeMinutes: number;
}

export interface MenuItemDetailDto extends MenuItemDto {
  chef: ChefDetailDto;
}

export interface ChefDto {
  id: string;
  name: string;
  nameAr: string;
  bio: string;
  imageUrl: string;
  specialties: string[];
  itemCount: number;
  rating: number;
}

export interface ChefDetailDto extends ChefDto {
  joinedYear: number;
}

export interface OrderItemDto {
  id: string;
  menuItemId: string;
  name: string;
  nameAr: string;
  imageUrl: string;
  price: number;
  qty: number;
  lineTotal: number;
}

export interface OrderDto {
  id: string;
  status: string;
  customerName: string;
  phone: string;
  area: string;
  street: string;
  building?: string;
  notes?: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  placedAt: string;
  estimatedDeliveryAt: string;
  items: OrderItemDto[];
}

export interface OrderStatusDto {
  id: string;
  status: string;
  estimatedDeliveryAt: string;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  area: string;
  street: string;
  building?: string;
  notes?: string;
  paymentMethod: string;
  items: { menuItemId: string; qty: number }[];
}

export interface SubscriptionDto {
  id: string;
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export interface CreateSubscriptionRequest {
  userId: string;
  type: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSubscriptionRequest {
  type?: string;
  status?: string;
  endDate?: string;
}

export interface BlogPostDto {
  id: string;
  title: string;
  titleAr: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  tags: string[];
}

export interface BlogPostsAdminResponse {
  data: BlogPostDto[];
  pagination: PaginationMetadata;
}

export interface TestimonialDto {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface StatsDto {
  menuItemCount: number;
  chefCount: number;
  subscriptionCount: number;
  blogPostCount: number;
  testimonialCount: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  message: string;
  databaseConnected: boolean;
}

export interface ContactSubmissionDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface OfficeInquirySubmissionDto {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  headCount: number;
  deliveryArea?: string;
  frequency?: string;
  message: string;
  createdAt: string;
}

export interface ListCategoriesResponse { data: CategoryDto[]; }
export interface ListMenuItemsResponse { data: MenuItemDto[]; pagination: PaginationMetadata; }
export interface GetMenuItemResponse { data: MenuItemDetailDto; }
export interface GetFeaturedItemsResponse { data: MenuItemDto[]; }
export interface ListChefsResponse { data: ChefDto[]; }
export interface GetChefResponse { data: ChefDetailDto; }

export interface AuthUser {
  username: string;
  role: string;
  token: string;
}
