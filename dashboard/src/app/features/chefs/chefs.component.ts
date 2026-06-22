import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { ChefDto } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-chefs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Chefs</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ filtered().length }} certified home chefs }
          </p>
        </div>
        <button class="btn-secondary gap-2" (click)="load()" aria-label="Refresh">
          <ng-icon name="lucideRefreshCw" size="14" />
        </button>
      </div>

      <div class="card p-4">
        <div class="relative w-full sm:w-80">
          <ng-icon name="lucideSearch" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="search" class="input pl-9" placeholder="Search chefs by name..."
                 [value]="search()" (input)="search$.next($any($event.target).value)"
                 aria-label="Search chefs" />
        </div>
      </div>

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (filtered().length === 0) {
        <app-empty-state iconName="lucideChefHat" title="No chefs found" message="No chefs match your search." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (chef of filtered(); track chef.id) {
            <article class="card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group" role="listitem">
              <div class="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/20 overflow-hidden mb-4 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-300 dark:group-hover:ring-primary-700 transition-all">
                @if (chef.imageUrl) {
                  <img [src]="chef.imageUrl" [alt]="chef.name" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center">
                    <ng-icon name="lucideChefHat" size="32" class="text-primary-400" />
                  </div>
                }
              </div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ chef.name }}</h3>
              <p class="text-xs text-gray-400 mb-3" style="direction:rtl">{{ chef.nameAr }}</p>
              <div class="flex items-center justify-center gap-2 mb-3 flex-wrap">
                <span class="badge bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <ng-icon name="lucideStar" size="11" /> {{ chef.rating | number:'1.1-1' }}
                </span>
                <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <ng-icon name="lucideUtensils" size="11" /> {{ chef.itemCount }} dishes
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 mb-3">{{ chef.bio }}</p>
              @if (chef.specialties?.length) {
                <div class="flex flex-wrap gap-1 justify-center">
                  @for (spec of chef.specialties.slice(0, 3); track spec) {
                    <span class="badge bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs">{{ spec }}</span>
                  }
                  @if (chef.specialties.length > 3) {
                    <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs">+{{ chef.specialties.length - 3 }}</span>
                  }
                </div>
              }
            </article>
          }
        </div>
      }
    </div>
  `
})
export class ChefsComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  loading  = signal(true);
  error    = signal(false);
  chefs    = signal<ChefDto[]>([]);
  filtered = signal<ChefDto[]>([]);
  search   = signal('');
  readonly search$ = new Subject<string>();

  ngOnInit(): void {
    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(q => { this.search.set(q); this.applyFilter(); });
    this.load();
  }

  load(): void {
    this.loading.set(true); this.error.set(false);
    this.api.getChefs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.chefs.set(r.data); this.filtered.set(r.data); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  applyFilter(): void {
    const q = this.search().toLowerCase().trim();
    this.filtered.set(q ? this.chefs().filter(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(q)) : this.chefs());
  }
}
