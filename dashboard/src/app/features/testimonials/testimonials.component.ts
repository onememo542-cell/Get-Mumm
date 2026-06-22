import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CommonModule, NgIconComponent, TranslatePipe, SkeletonComponent, EmptyStateComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'TESTIMONIALS.TITLE' | translate }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            @if (!loading()) { {{ items().length }} {{ 'TESTIMONIALS.SUBTITLE_COUNT' | translate }} }
          </p>
        </div>
        <button class="btn-secondary gap-2" (click)="load()" [attr.aria-label]="'COMMON.REFRESH' | translate">
          <ng-icon name="lucideRefreshCw" size="14" />
        </button>
      </div>

      @if (!loading() && !error() && items().length) {
        <div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-4">
            <div class="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">{{ avgRating() | number:'1.1-1' }}</div>
            <div>
              <div class="flex items-center gap-0.5 text-amber-400">
                @for (filled of starFill(); track $index) {
                  <ng-icon name="lucideStar" size="16" [class]="filled ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'" />
                }
              </div>
              <p class="text-xs text-gray-400 mt-0.5">{{ 'TESTIMONIALS.AVERAGE_RATING' | translate }}</p>
            </div>
          </div>
          <div class="sm:ms-auto text-sm text-gray-500 dark:text-gray-400">
            {{ 'TESTIMONIALS.BASED_ON' | translate }} {{ items().length }}
            {{ items().length !== 1 ? ('TESTIMONIALS.REVIEWS' | translate) : ('TESTIMONIALS.REVIEW' | translate) }}
          </div>
        </div>
      }

      @if (loading()) {
        <app-skeleton type="cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (items().length === 0) {
        <app-empty-state iconName="lucideStar"
                         [title]="'TESTIMONIALS.EMPTY_TITLE' | translate"
                         [message]="'TESTIMONIALS.EMPTY_MSG' | translate" />
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          @for (t of items(); track t.id) {
            <article class="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow" role="listitem">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center
                              text-primary-700 dark:text-primary-400 font-bold text-sm flex-shrink-0">
                    {{ (t.customerName ?? 'A').charAt(0).toUpperCase() }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 dark:text-white truncate">{{ t.customerName }}</p>
                    <p class="text-xs text-gray-400 flex items-center gap-1">
                      <ng-icon name="lucideCalendar" size="10" />
                      {{ t.createdAt | date:'dd MMM yyyy' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-0.5 flex-shrink-0" [attr.aria-label]="t.rating + ' / 5'">
                  @for (i of [1,2,3,4,5]; track i) {
                    <ng-icon name="lucideStar" size="13" [class]="i <= t.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'" />
                  }
                </div>
              </div>
              <blockquote class="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-4
                                 border-s-2 border-primary-200 dark:border-primary-700 ps-3">
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
    const l = this.items();
    return l.length ? l.reduce((s, t) => s + t.rating, 0) / l.length : 0;
  }
  starFill(): boolean[] { return [1,2,3,4,5].map(i => i <= this.avgRating()); }

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading.set(true); this.error.set(false);
    this.api.getTestimonials().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r  => { this.items.set(r); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
