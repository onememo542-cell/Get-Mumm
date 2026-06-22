import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Chefs</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ filtered().length }} certified home chefs }
          </p>
        </div>
        <button class="btn-secondary" (click)="load()" aria-label="Refresh chefs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      <div class="card p-3 md:p-4">
        <div class="relative w-full sm:w-80">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
          <input type="search" class="input pl-9" placeholder="Search chefs by name..."
                 [value]="search()"
                 (input)="search$.next($any($event.target).value)"
                 aria-label="Search chefs" />
        </div>
      </div>

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (filtered().length === 0) {
        <app-empty-state icon="👨‍🍳" title="No chefs found" message="No chefs match your search." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (chef of filtered(); track chef.id) {
            <article class="card p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group" role="listitem">
              <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 overflow-hidden mb-4 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-300 dark:group-hover:ring-primary-700 transition-all">
                @if (chef.imageUrl) {
                  <img [src]="chef.imageUrl" [alt]="chef.name" class="w-full h-full object-cover" loading="lazy" decoding="async" />
                } @else {
                  <div class="w-full h-full flex items-center justify-center text-3xl">👨‍🍳</div>
                }
              </div>
              <h3 class="font-bold text-gray-900 dark:text-white">{{ chef.name }}</h3>
              <p class="text-xs text-gray-400 mb-3 dir-rtl">{{ chef.nameAr }}</p>
              <div class="flex items-center justify-center gap-2 mb-3 flex-wrap">
                <span class="badge bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">⭐ {{ chef.rating | number:'1.1-1' }}</span>
                <span class="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">🍽️ {{ chef.itemCount }} dishes</span>
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
  `,
  styles: [`.dir-rtl { direction: rtl; }`]
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
    this.loading.set(true);
    this.error.set(false);
    this.api.getChefs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.chefs.set(r.data); this.filtered.set(r.data); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }

  applyFilter(): void {
    const q = this.search().toLowerCase().trim();
    this.filtered.set(q ? this.chefs().filter(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(q)) : this.chefs());
  }
}
