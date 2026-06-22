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
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StatCardComponent, SkeletonComponent, ErrorStateComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back! Here's your platform overview.</p>
        </div>
        <button class="btn-secondary self-start sm:self-auto" (click)="load()" aria-label="Refresh dashboard">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      @if (loading()) {
        <app-skeleton type="stat-cards" [count]="5" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-skeleton type="list" [count]="3" />
          <app-skeleton type="list" [count]="4" />
        </div>
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (stats()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <app-stat-card icon="🍽️" label="Menu Items"    [value]="stats()!.menuItemCount"    iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <app-stat-card icon="👨‍🍳" label="Active Chefs"  [value]="stats()!.chefCount"         iconBg="bg-orange-50 dark:bg-orange-900/20" />
          <app-stat-card icon="🔔" label="Subscriptions" [value]="stats()!.subscriptionCount" iconBg="bg-blue-50 dark:bg-blue-900/20" />
          <app-stat-card icon="📝" label="Blog Posts"   [value]="stats()!.blogPostCount"     iconBg="bg-green-50 dark:bg-green-900/20" />
          <app-stat-card icon="⭐" label="Testimonials" [value]="stats()!.testimonialCount"  iconBg="bg-purple-50 dark:bg-purple-900/20" class="col-span-2 sm:col-span-1" />
        </div>

        <!-- Health + Overview -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- System Health -->
          <div class="card p-6" role="region" aria-label="System health">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">System Health</h3>
            @if (health()) {
              <div class="space-y-1">
                <div class="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                  <span class="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <span class="badge font-medium" [class]="health()!.status === 'Healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'">
                    {{ health()!.status === 'Healthy' ? '✓ Healthy' : '✗ ' + health()!.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span class="badge font-medium" [class]="health()!.databaseConnected ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'">
                    {{ health()!.databaseConnected ? '✓ Connected' : '✗ Disconnected' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-2.5">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Last Check</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ health()!.timestamp | date:'HH:mm:ss, dd MMM' }}</span>
                </div>
              </div>
            } @else {
              <p class="text-sm text-gray-400 py-4 text-center">Health check unavailable</p>
            }
          </div>

          <!-- Platform Overview -->
          <div class="card p-6" role="region" aria-label="Platform overview">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-5">Content Breakdown</h3>
            <div class="space-y-4">
              @for (item of breakdown(); track item.label) {
                <div class="flex items-center gap-3">
                  <span class="text-base w-6 text-center flex-shrink-0">{{ item.icon }}</span>
                  <div class="w-20 sm:w-24 text-xs text-gray-500 dark:text-gray-400 truncate flex-shrink-0">{{ item.label }}</div>
                  <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2" role="progressbar" [attr.aria-valuenow]="item.pct" aria-valuemin="0" aria-valuemax="100">
                    <div [class]="item.color + ' h-2 rounded-full transition-all duration-700'" [style.width.%]="item.pct"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-800 dark:text-white w-8 text-right flex-shrink-0">{{ item.value }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Nav Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          @for (link of quickLinks; track link.label) {
            <a [href]="link.route"
               class="card p-4 flex items-center gap-3 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all group cursor-pointer no-underline">
              <span class="text-2xl">{{ link.icon }}</span>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{{ link.label }}</span>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api        = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  loading = signal(true);
  error   = signal(false);
  stats   = signal<StatsDto | null>(null);
  health  = signal<HealthCheckResponse | null>(null);

  readonly quickLinks = [
    { icon: '🍽️', label: 'Menu Items',    route: '/menu' },
    { icon: '👨‍🍳', label: 'Chefs',         route: '/chefs' },
    { icon: '🔔', label: 'Subscriptions', route: '/subscriptions' },
    { icon: '📊', label: 'Analytics',     route: '/stats' },
  ];

  breakdown() {
    const s = this.stats();
    if (!s) return [];
    const total = s.menuItemCount + s.chefCount + s.subscriptionCount + s.blogPostCount + s.testimonialCount || 1;
    return [
      { icon: '🍽️', label: 'Menu',    value: s.menuItemCount,    pct: (s.menuItemCount / total) * 100,    color: 'bg-amber-400' },
      { icon: '👨‍🍳', label: 'Chefs',   value: s.chefCount,         pct: (s.chefCount / total) * 100,         color: 'bg-orange-400' },
      { icon: '🔔', label: 'Subs',    value: s.subscriptionCount, pct: (s.subscriptionCount / total) * 100, color: 'bg-blue-400' },
      { icon: '📝', label: 'Blog',    value: s.blogPostCount,     pct: (s.blogPostCount / total) * 100,     color: 'bg-green-400' },
      { icon: '⭐', label: 'Reviews', value: s.testimonialCount,  pct: (s.testimonialCount / total) * 100,  color: 'bg-purple-400' },
    ];
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    // Parallel data fetch with forkJoin — single subscription
    forkJoin({
      stats:  this.api.getStats(),
      health: this.api.getHealth(),
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, health }) => {
          this.stats.set(stats);
          this.health.set(health);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
