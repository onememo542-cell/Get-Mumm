import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { MenuItemDto, CategoryDto } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Menu Items</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading() && !error()) { {{ filtered().length }} of {{ items().length }} items }
          </p>
        </div>
        <button class="btn-secondary self-start sm:self-auto" (click)="load()" aria-label="Refresh">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      <!-- Filters -->
      <div class="card p-3 md:p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
            <input type="search" class="input pl-9" placeholder="Search menu items..."
                   [value]="search()"
                   (input)="onSearch($any($event.target).value)"
                   aria-label="Search menu items" />
          </div>
          <select class="input w-full sm:w-44" [value]="selectedCategory()" (change)="selectedCategory.set($any($event.target).value); applyFilter()" aria-label="Filter by category">
            <option value="">All Categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
          <select class="input w-full sm:w-36" [value]="availFilter()" (change)="availFilter.set($any($event.target).value); applyFilter()" aria-label="Filter by availability">
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        <!-- Active filter chips -->
        @if (selectedCategory() || availFilter() || search()) {
          <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
            @if (search()) {
              <span class="badge bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 gap-1">
                "{{ search() }}" <button (click)="clearSearch()" class="hover:opacity-70" aria-label="Clear search">✕</button>
              </span>
            }
            @if (selectedCategory()) {
              <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 gap-1">
                {{ categoryName() }} <button (click)="selectedCategory.set(''); applyFilter()" class="hover:opacity-70" aria-label="Clear category">✕</button>
              </span>
            }
            @if (availFilter()) {
              <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 gap-1">
                {{ availFilter() === 'true' ? 'Available' : 'Unavailable' }}
                <button (click)="availFilter.set(''); applyFilter()" class="hover:opacity-70" aria-label="Clear status">✕</button>
              </span>
            }
            <button class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" (click)="clearAll()">Clear all</button>
          </div>
        }
      </div>

      @if (loading()) {
        <app-skeleton type="cards" [count]="8" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="🍽️" title="No items found" message="Try adjusting your search or filters." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list">
          @for (item of filtered(); track item.id) {
            <article class="card overflow-hidden hover:shadow-md transition-shadow group" role="listitem">
              <div class="relative h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                @if (item.imageUrl) {
                  <img [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-5xl opacity-40">🍽️</div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="absolute top-2 left-2 right-2 flex justify-between items-start gap-1">
                  @if (item.isFeatured) {
                    <span class="badge bg-amber-400 text-white text-xs shadow-sm">⭐ Featured</span>
                  } @else { <span></span> }
                  <span class="badge text-xs shadow-sm" [class]="item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'">
                    {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 dark:text-white text-sm truncate" [title]="item.name">{{ item.name }}</h3>
                <p class="text-xs text-gray-400 truncate dir-rtl">{{ item.nameAr }}</p>
                <div class="flex items-center justify-between mt-2">
                  <span class="text-primary-600 dark:text-primary-400 font-bold">EGP {{ item.price | number:'1.0-0' }}</span>
                  <span class="text-xs text-gray-400 flex items-center gap-0.5">⭐ {{ item.rating | number:'1.1-1' }}</span>
                </div>
                <div class="mt-2 flex items-center gap-1 flex-wrap">
                  <span class="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs">{{ item.categoryName }}</span>
                  @for (diet of item.dietary.slice(0, 2); track diet) {
                    <span class="badge bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs">{{ diet }}</span>
                  }
                  @if (item.dietary.length > 2) {
                    <span class="text-xs text-gray-400">+{{ item.dietary.length - 2 }}</span>
                  }
                </div>
                <p class="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <span>{{ item.chefName }}</span>
                  <span class="text-gray-300 dark:text-gray-600">·</span>
                  <span>{{ item.prepTimeMinutes }} min</span>
                </p>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [`.dir-rtl { direction: rtl; }`]
})
export class MenuComponent implements OnInit {
  private api        = inject(ApiService);
  private cdr        = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  loading          = signal(true);
  error            = signal(false);
  items            = signal<MenuItemDto[]>([]);
  categories       = signal<CategoryDto[]>([]);
  filtered         = signal<MenuItemDto[]>([]);
  search           = signal('');
  selectedCategory = signal('');
  availFilter      = signal('');

  private search$ = new Subject<string>();

  ngOnInit(): void {
    // Debounced search — 300 ms, skip duplicate values
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(q => { this.search.set(q); this.applyFilter(); });

    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    forkJoin({
      menu:       this.api.getMenuItems(1, 100),
      categories: this.api.getCategories(),
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ menu, categories }) => {
          this.items.set(menu.data);
          this.categories.set(categories.data);
          this.applyFilter();
          this.loading.set(false);
        },
        error: () => { this.error.set(true); this.loading.set(false); },
      });
  }

  onSearch(val: string): void { this.search$.next(val); }

  applyFilter(): void {
    let list = this.items();
    const q  = this.search().toLowerCase().trim();
    if (q)    list = list.filter(i => i.name.toLowerCase().includes(q) || i.nameAr.includes(q) || i.chefName.toLowerCase().includes(q));
    if (this.selectedCategory()) list = list.filter(i => i.categoryId === this.selectedCategory());
    if (this.availFilter() !== '') list = list.filter(i => String(i.isAvailable) === this.availFilter());
    this.filtered.set(list);
  }

  categoryName(): string {
    return this.categories().find(c => c.id === this.selectedCategory())?.name ?? '';
  }

  clearSearch(): void   { this.search.set(''); this.search$.next(''); this.applyFilter(); }
  clearAll(): void      { this.search.set(''); this.selectedCategory.set(''); this.availFilter.set(''); this.applyFilter(); }
}
