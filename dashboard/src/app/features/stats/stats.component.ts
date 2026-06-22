import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
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
  imports: [CommonModule, NgIconComponent, TranslatePipe, StatCardComponent, SkeletonComponent, ErrorStateComponent],
  template: `
    <div class="space-y-7">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'NAV.ANALYTICS' | translate }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Platform-wide statistics and system insights</p>
        </div>
        <button class="btn-secondary self-start sm:self-auto gap-2" (click)="load()" [attr.aria-label]="'COMMON.REFRESH' | translate">
          <ng-icon name="lucideRefreshCw" size="14" />
          {{ 'COMMON.REFRESH' | translate }}
        </button>
      </div>

      @if (loading()) {
        <app-skeleton type="stat-cards" [count]="6" gridClass="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
        <app-skeleton type="list" [count]="5" />
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (stats()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-stat-card iconName="lucideUtensils"   iconColor="text-amber-600"  iconBg="bg-amber-50 dark:bg-amber-900/20"   [label]="'STATS.MENU_ITEMS' | translate"    [value]="stats()!.menuItemCount"    [sub]="'STATS.ACTIVE_ITEMS' | translate" />
          <app-stat-card iconName="lucideChefHat"    iconColor="text-orange-600" iconBg="bg-orange-50 dark:bg-orange-900/20" [label]="'STATS.CHEFS' | translate"          [value]="stats()!.chefCount"         [sub]="'STATS.CERTIFIED_COOKS' | translate" />
          <app-stat-card iconName="lucideBell"       iconColor="text-blue-600"   iconBg="bg-blue-50 dark:bg-blue-900/20"     [label]="'STATS.SUBSCRIPTIONS' | translate"  [value]="stats()!.subscriptionCount" [sub]="'STATS.ACTIVE_SUBS' | translate" />
          <app-stat-card iconName="lucideFileText"   iconColor="text-green-600"  iconBg="bg-green-50 dark:bg-green-900/20"   [label]="'STATS.BLOG_POSTS' | translate"     [value]="stats()!.blogPostCount"     [sub]="'STATS.PUBLISHED' | translate" />
          <app-stat-card iconName="lucideStar"       iconColor="text-purple-600" iconBg="bg-purple-50 dark:bg-purple-900/20" [label]="'STATS.TESTIMONIALS' | translate"   [value]="stats()!.testimonialCount"  [sub]="'STATS.REVIEWS' | translate" />
          <app-stat-card iconName="lucideTrendingUp" iconColor="text-rose-600"   iconBg="bg-rose-50 dark:bg-rose-900/20"     [label]="'STATS.TOTAL_CONTENT' | translate"  [value]="totalContent()"              [sub]="'STATS.COMBINED' | translate" />
        </div>

        <div class="card p-6">
          <div class="flex items-center gap-2 mb-6">
            <ng-icon name="lucideBarChart2" size="16" class="text-gray-500" />
            <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ 'DASHBOARD.CONTENT_BREAKDOWN' | translate }}</h3>
          </div>
          <div class="space-y-5">
            @for (item of breakdown(); track item.labelKey) {
              <div class="flex items-center gap-4">
                <ng-icon [name]="item.icon" size="16" [class]="item.textColor + ' flex-shrink-0'" />
                <div class="w-24 sm:w-32 text-sm text-gray-600 dark:text-gray-400 truncate flex-shrink-0">{{ item.labelKey | translate }}</div>
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2"
                     role="progressbar" [attr.aria-valuenow]="item.pct | number:'1.0-0'" aria-valuemin="0" aria-valuemax="100">
                  <div [class]="item.color + ' h-2 rounded-full transition-all duration-700'" [style.width.%]="item.pct"></div>
                </div>
                <span class="text-sm font-bold text-gray-800 dark:text-white w-10 text-end flex-shrink-0 tabular-nums">{{ item.value }}</span>
                <span class="text-xs text-gray-400 w-10 text-end flex-shrink-0 hidden sm:block">{{ item.pct | number:'1.0-0' }}%</span>
              </div>
            }
          </div>
        </div>

        @if (health()) {
          <div class="card p-6">
            <div class="flex items-center gap-2 mb-5">
              <ng-icon name="lucideActivity" size="16" class="text-gray-500" />
              <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ 'DASHBOARD.SYSTEM_HEALTH' | translate }}</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="rounded-2xl p-5 flex flex-col items-center text-center"
                   [class]="health()!.status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <ng-icon [name]="health()!.status === 'Healthy' ? 'lucideCheckCircle2' : 'lucideXCircle'" size="32"
                         [class]="health()!.status === 'Healthy' ? 'text-green-500 mb-2' : 'text-red-500 mb-2'" />
                <p class="text-xs font-semibold uppercase tracking-wide mb-1"
                   [class]="health()!.status === 'Healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600'">
                  {{ 'DASHBOARD.API_STATUS' | translate }}
                </p>
                <p class="text-sm font-bold"
                   [class]="health()!.status === 'Healthy' ? 'text-green-800 dark:text-green-300' : 'text-red-800'">
                  {{ health()!.status }}
                </p>
              </div>
              <div class="rounded-2xl p-5 flex flex-col items-center text-center"
                   [class]="health()!.databaseConnected ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <ng-icon [name]="health()!.databaseConnected ? 'lucideDatabase' : 'lucideXCircle'" size="32"
                         [class]="health()!.databaseConnected ? 'text-green-500 mb-2' : 'text-red-500 mb-2'" />
                <p class="text-xs font-semibold uppercase tracking-wide mb-1"
                   [class]="health()!.databaseConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600'">
                  {{ 'DASHBOARD.DATABASE' | translate }}
                </p>
                <p class="text-sm font-bold"
                   [class]="health()!.databaseConnected ? 'text-green-800 dark:text-green-300' : 'text-red-800'">
                  {{ health()!.databaseConnected ? ('DASHBOARD.CONNECTED' | translate) : ('DASHBOARD.DISCONNECTED' | translate) }}
                </p>
              </div>
              <div class="rounded-2xl p-5 flex flex-col items-center text-center bg-blue-50 dark:bg-blue-900/10 sm:col-span-2">
                <ng-icon name="lucideCalendar" size="32" class="text-blue-500 mb-2" />
                <p class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">{{ 'DASHBOARD.LAST_CHECK' | translate }}</p>
                <p class="text-sm font-medium text-blue-800 dark:text-blue-300">{{ health()!.timestamp | date:'HH:mm:ss, dd MMM yyyy' }}</p>
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
    return s ? s.menuItemCount + s.chefCount + s.subscriptionCount + s.blogPostCount + s.testimonialCount : 0;
  }

  breakdown() {
    const s = this.stats(); if (!s) return [];
    const total = this.totalContent() || 1;
    return [
      { icon: 'lucideUtensils',  textColor: 'text-amber-500',  labelKey: 'STATS.MENU_ITEMS',    value: s.menuItemCount,    pct: (s.menuItemCount / total) * 100,    color: 'bg-amber-400' },
      { icon: 'lucideChefHat',   textColor: 'text-orange-500', labelKey: 'STATS.CHEFS',          value: s.chefCount,         pct: (s.chefCount / total) * 100,         color: 'bg-orange-400' },
      { icon: 'lucideBell',      textColor: 'text-blue-500',   labelKey: 'STATS.SUBSCRIPTIONS', value: s.subscriptionCount, pct: (s.subscriptionCount / total) * 100, color: 'bg-blue-400' },
      { icon: 'lucideFileText',  textColor: 'text-green-500',  labelKey: 'STATS.BLOG_POSTS',     value: s.blogPostCount,     pct: (s.blogPostCount / total) * 100,     color: 'bg-green-400' },
      { icon: 'lucideStar',      textColor: 'text-purple-500', labelKey: 'STATS.TESTIMONIALS',  value: s.testimonialCount,  pct: (s.testimonialCount / total) * 100,  color: 'bg-purple-400' },
    ];
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true); this.error.set(false);
    forkJoin({ stats: this.api.getStats(), health: this.api.getHealth() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ stats, health }) => { this.stats.set(stats); this.health.set(health); this.loading.set(false); },
        error: () => { this.error.set(true); this.loading.set(false); },
      });
  }
}
