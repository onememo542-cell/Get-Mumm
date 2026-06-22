import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { MenuItemDto, CategoryDto } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Menu Items</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ items().length }} items across {{ categories().length }} categories</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="card p-4 flex flex-col sm:flex-row gap-3">
        <input type="search" class="input flex-1" placeholder="🔍 Search menu items..." [(ngModel)]="search" (input)="applyFilter()" />
        <select class="input w-full sm:w-48" [(ngModel)]="selectedCategory" (change)="applyFilter()">
          <option value="">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
          }
        </select>
        <select class="input w-full sm:w-40" [(ngModel)]="availFilter" (change)="applyFilter()">
          <option value="">All Status</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="🍽️" title="No menu items" message="No items match your filters." />
      } @else {
        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          @for (item of filtered(); track item.id) {
            <div class="card overflow-hidden hover:shadow-md transition-shadow">
              <div class="relative h-40 bg-gray-100 dark:bg-gray-800">
                @if (item.imageUrl) {
                  <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover" loading="lazy" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                }
                <div class="absolute top-2 right-2 flex gap-1">
                  @if (item.isFeatured) {
                    <span class="badge bg-amber-400 text-white text-xs">⭐ Featured</span>
                  }
                  <span class="badge text-xs" [class]="item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm truncate">{{ item.name }}</h3>
                <p class="text-xs text-gray-400 truncate">{{ item.nameAr }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-primary-600 font-bold text-sm">EGP {{ item.price | number:'1.0-0' }}</span>
                  <span class="text-xs text-gray-400">⭐ {{ item.rating | number:'1.1-1' }}</span>
                </div>
                <div class="mt-2 flex items-center gap-1 flex-wrap">
                  <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs">{{ item.categoryName }}</span>
                  @for (diet of item.dietary.slice(0,2); track diet) {
                    <span class="badge bg-green-50 text-green-700 text-xs">{{ diet }}</span>
                  }
                </div>
                <p class="text-xs text-gray-400 mt-1">Chef: {{ item.chefName }} · {{ item.prepTimeMinutes }} min</p>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class MenuComponent implements OnInit {
  private api = inject(ApiService);
  loading         = signal(true);
  items           = signal<MenuItemDto[]>([]);
  categories      = signal<CategoryDto[]>([]);
  filtered        = signal<MenuItemDto[]>([]);
  search          = '';
  selectedCategory = '';
  availFilter     = '';

  ngOnInit(): void {
    this.api.getCategories().subscribe({ next: r => this.categories.set(r.data), error: () => {} });
    this.api.getMenuItems(1, 100).subscribe({
      next: r => { this.items.set(r.data); this.filtered.set(r.data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  applyFilter(): void {
    let list = this.items();
    if (this.search) list = list.filter(i => i.name.toLowerCase().includes(this.search.toLowerCase()) || i.nameAr.includes(this.search));
    if (this.selectedCategory) list = list.filter(i => i.categoryId === this.selectedCategory);
    if (this.availFilter !== '') list = list.filter(i => String(i.isAvailable) === this.availFilter);
    this.filtered.set(list);
  }
}
