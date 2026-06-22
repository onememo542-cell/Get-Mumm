import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../core/services/api.service';
import { StatsDto, HealthCheckResponse } from '../../models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StatCardComponent, SkeletonComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Platform-wide statistics and system insights</p>
        </div>
        <button class="btn-secondary self-start sm:self-auto" (click)="load()" aria-label="Refresh analytics">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      @if (loading()) {
        <app-skeleton type="stat-cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
        <app-skeleton type="list" [count]="5" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (stats()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-stat-card icon="🍽️" label="Total Menu Items"    [value]="stats()!.menuItemCount"    sub="Active items on the platform"   iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <app-stat-card icon="👨‍🍳" label="Total Chefs"         [value]="stats()!.chefCount"         sub="Certified home cooks"            iconBg="bg-orange-50 dark:bg-orange-900/20" />
          <app-stat-card icon="🔔" label="Subscriptions"      [value]="stats()!.subscriptionCount" sub="Active meal subscriptions"       iconBg="bg-blue-50 dark:bg-blue-900/20" />
          <app-stat-card icon="📝" label="Blog Posts"         [value]="stats()!.blogPostCount"     sub="Published articles"              iconBg="bg-green-50 dark:bg-green-900/20" />
          <app-stat-card icon="⭐" label="Testimonials"       [value]="stats()!.testimonialCount"  sub="Customer reviews"                iconBg="bg-purple-50 dark:bg-purple-900/20" />
          <app-stat-card icon="📊" label="Total Content"      [value]="totalContent()"              sub="All items combined"              iconBg="bg-rose-50 dark:bg-rose-900/20" />
        </div>

        <!-- Content breakdown -->
        <div class="card p-6" role="region" aria-label="Content breakdown">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-6">Content Breakdown</h3>
          <div class="space-y-5">
            @for (item of breakdown(); track item.label) {
              <div class="flex items-center gap-4">
                <span class="text-xl w-7 flex-shrink-0" aria-hidden="true">{{ item.icon }}</span>
                <div class="w-24 sm:w-32 text-sm text-gray-600 dark:text-gray-400 truncate flex-shrink-0">{{ item.label }}</div>
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3"
                     role="progressbar" [attr.aria-valuenow]="item.pct | number:'1.0-0'"
                     aria-valuemin="0" aria-valuemax="100"
                     [attr.aria-label]="item.label + ': ' + (item.pct | number:'1.0-0') + '%'">
                  <div [class]="item.color + ' h-3 rounded-full transition-all duration-700'" [style.width.%]="item.pct"></div>
                </div>
                <span class="text-sm font-bold text-gray-800 dark:text-white w-10 text-right flex-shrink-0">{{ item.value }}</span>
                <span class="text-xs text-gray-400 w-10 text-right flex-shrink-0 hidden sm:block">{{ item.pct | number:'1.0-0' }}%</span>
              </div>
            }
          </div>
        </div>

        <!-- Health Panel -->
        @if (health()) {
          <div class="card p-6" role="region" aria-label="System health">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">System Health</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="text-center p-4 rounded-xl"
                   [class]="health()!.status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <p class="text-3xl mb-2">{{ health()!.status === 'Healthy' ? '✅' : '❌' }}</p>
                <p class="text-xs font-semibold uppercase tracking-wide"
                   [class]="health()!.status === 'Healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600'">API Status</p>
                <p class="text-sm font-bold mt-1"
                   [class]="health()!.status === 'Healthy' ? 'text-green-800 dark:text-green-300' : 'text-red-800'">
                  {{ health()!.status }}
                </p>
              </div>
              <div class="text-center p-4 rounded-xl"
                   [class]="health()!.databaseConnected ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <p class="text-3xl mb-2">{{ health()!.databaseConnected ? '🟢' : '🔴' }}</p>
                <p class="text-xs font-semibold uppercase tracking-wide"
                   [class]="health()!.databaseConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600'">Database</p>
                <p class="text-sm font-bold mt-1"
                   [class]="health()!.databaseConnected ? 'text-green-800 dark:text-green-300' : 'text-red-800'">
                  {{ health()!.databaseConnected ? 'Connected' : 'Offline' }}
                </p>
              </div>
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 sm:col-span-2">
                <p class="text-3xl mb-2">🕐</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Last Health Check</p>
                <p class="text-sm font-medium mt-1 text-blue-800 dark:text-blue-300">
                  {{ health()!.timestamp | date:'HH:mm:ss, dd MMM yyyy' }}
                </p>
                <p class="text-xs text-blue-500 dark:text-blue-400 mt-1">{{ health()!.message }}</p>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class StatsComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error   = signal(false);
  stats   = signal<StatsDto | null>(null);
  health  = signal<HealthCheckResponse | null>(null);

  totalContent(): number {
    const s = this.stats();
    if (!s) return 0;
    return s.menuItemCount + s.chefCount + s.subscriptionCount + s.blogPostCount + s.testimonialCount;
  }

  breakdown() {
    const s = this.stats();
    if (!s) return [];
    const total = this.totalContent() || 1;
    return [
      { icon: '🍽️', label: 'Menu Items',    value: s.menuItemCount,    pct: (s.menuItemCount / total) * 100,    color: 'bg-amber-400' },
      { icon: '👨‍🍳', label: 'Chefs',          value: s.chefCount,         pct: (s.chefCount / total) * 100,         color: 'bg-orange-400' },
      { icon: '🔔', label: 'Subscriptions', value: s.subscriptionCount, pct: (s.subscriptionCount / total) * 100, color: 'bg-blue-400' },
      { icon: '📝', label: 'Blog Posts',    value: s.blogPostCount,     pct: (s.blogPostCount / total) * 100,     color: 'bg-green-400' },
      { icon: '⭐', label: 'Testimonials',  value: s.testimonialCount,  pct: (s.testimonialCount / total) * 100,  color: 'bg-purple-400' },
    ];
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    forkJoin({ stats: this.api.getStats(), health: this.api.getHealth() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, health }) => { this.stats.set(stats); this.health.set(health); this.loading.set(false); },
        error: () => { this.error.set(true); this.loading.set(false); },
      });
  }
}
