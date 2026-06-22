import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { TestimonialDto } from '../../models';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ items().length }} customer reviews }
          </p>
        </div>
        <button class="btn-secondary" (click)="load()" aria-label="Refresh testimonials">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      <!-- Avg rating -->
      @if (!loading() && !error() && items().length) {
        <div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="text-4xl font-bold text-gray-900 dark:text-white">{{ avgRating() | number:'1.1-1' }}</div>
            <div>
              <div class="flex gap-0.5 text-amber-400">
                @for (s of stars(); track $index) { <span>{{ s }}</span> }
              </div>
              <p class="text-xs text-gray-400 mt-0.5">Average rating</p>
            </div>
          </div>
          <div class="sm:ml-auto text-sm text-gray-500 dark:text-gray-400">
            Based on {{ items().length }} review{{ items().length !== 1 ? 's' : '' }}
          </div>
        </div>
      }

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (items().length === 0) {
        <app-empty-state icon="⭐" title="No testimonials yet" message="Customer reviews will appear here." />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (t of items(); track t.id) {
            <article class="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow" role="listitem">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-sm flex-shrink-0"
                       aria-hidden="true">
                    {{ (t.customerName ?? 'A').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ t.customerName }}</p>
                    <p class="text-xs text-gray-400">{{ t.createdAt | date:'dd MMM yyyy' }}</p>
                  </div>
                </div>
                <div class="flex text-amber-400 text-sm flex-shrink-0" [attr.aria-label]="t.rating + ' out of 5 stars'">
                  @for (i of [1,2,3,4,5]; track i) {
                    <span>{{ i <= t.rating ? '⭐' : '☆' }}</span>
                  }
                </div>
              </div>
              <blockquote class="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-4 border-l-2 border-primary-200 dark:border-primary-800 pl-3">
                "{{ t.content }}"
              </blockquote>
            </article>
          }
        </div>
      }
    </div>
  `
})
export class TestimonialsComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error   = signal(false);
  items   = signal<TestimonialDto[]>([]);

  avgRating(): number {
    const list = this.items();
    if (!list.length) return 0;
    return list.reduce((s, t) => s + t.rating, 0) / list.length;
  }

  stars(): string[] {
    const avg  = this.avgRating();
    const full = Math.floor(avg);
    const half = avg - full >= 0.5;
    return Array.from({ length: 5 }, (_, i) => i < full ? '⭐' : (i === full && half ? '⭐' : '☆'));
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.api.getTestimonials().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => { this.items.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
