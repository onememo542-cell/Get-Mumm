import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
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
  imports: [CommonModule, RouterLink, NgIconComponent, StatCardComponent, SkeletonComponent, ErrorStateComponent],
  template: `
    <div class="space-y-7">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back — here's your platform at a glance.</p>
        </div>
        <button class="btn-secondary self-start sm:self-auto gap-2" (click)="load()" aria-label="Refresh">
          <ng-icon name="lucideRefreshCw" size="14" />
          Refresh
        </button>
      </div>

      @if (loading()) {
        <app-skeleton type="stat-cards" [count]="5" gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-skeleton type="list" [count]="3" />
          <app-skeleton type="list" [count]="5" />
        </div>
      } @else if (error()) {
        <app-error-state (retry)="load()" />
      } @else if (stats()) {

        <!-- Stats Row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <app-stat-card iconName="lucideUtensils"      iconColor="text-amber-600"  iconBg="bg-amber-50 dark:bg-amber-900/20"   label="Menu Items"    [value]="stats()!.menuItemCount" />
          <app-stat-card iconName="lucideChefHat"       iconColor="text-orange-600" iconBg="bg-orange-50 dark:bg-orange-900/20" label="Chefs"         [value]="stats()!.chefCount" />
          <app-stat-card iconName="lucideBell"          iconColor="text-blue-600"   iconBg="bg-blue-50 dark:bg-blue-900/20"     label="Subscriptions" [value]="stats()!.subscriptionCount" class="col-span-2 sm:col-span-1" />
          <app-stat-card iconName="lucideFileText"      iconColor="text-green-600"  iconBg="bg-green-50 dark:bg-green-900/20"   label="Blog Posts"   [value]="stats()!.blogPostCount" />
          <app-stat-card iconName="lucideStar"          iconColor="text-purple-600" iconBg="bg-purple-50 dark:bg-purple-900/20" label="Testimonials" [value]="stats()!.testimonialCount" />
        </div>

        <!-- Health + Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <!-- System Health -->
          <div class="card p-6" role="region" aria-label="System health">
            <div class="flex items-center gap-2 mb-5">
              <ng-icon name="lucideActivity" size="16" class="text-gray-500" />
              <h3 class="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">System Health</h3>
            </div>
            @if (health()) {
              <div class="space-y-1">
                <div class="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ng-icon name="lucideServer" size="14" class="opacity-60" />
                    API Status
                  </div>
                  <span class="badge font-medium" [class]="health()!.status === 'Healthy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'">
                    {{ health()!.status === 'Healthy' ? '● Healthy' : '● ' + health()!.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ng-icon name="lucideDatabase" size="14" class="opacity-60" />
                    Database
                  </div>
                  <span class="badge font-medium" [class]="health()!.databaseConnected ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'">
                    {{ health()!.databaseConnected ? '● Connected' : '● Disconnected' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-3">
                  <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ng-icon name="lucideCalendar" size="14" class="opacity-60" />
                    Last Check
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ health()!.timestamp | date:'HH:mm:ss, dd MMM' }}</span>
                </div>
              </div>
            } @else {
              <p class="text-sm text-gray-400 text-center py-6">Health check unavailable</p>
            }
          </div>

          <!-- Content Breakdown -->
          <div class="card p-6" role="region" aria-label="Content breakdown">
            <div class="flex items-center gap-2 mb-5">
              <ng-icon name="lucideBarChart2" size="16" class="text-gray-500" />
              <h3 class="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">Content Breakdown</h3>
            </div>
            <div class="space-y-4">
              @for (item of breakdown(); track item.label) {
                <div class="flex items-center gap-3">
                  <ng-icon [name]="item.icon" size="15" [class]="item.textColor + ' flex-shrink-0'" />
                  <span class="text-xs text-gray-500 dark:text-gray-400 w-20 truncate flex-shrink-0">{{ item.label }}</span>
                  <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5" role="progressbar" [attr.aria-valuenow]="item.pct" aria-valuemin="0" aria-valuemax="100">
                    <div [class]="item.color + ' h-1.5 rounded-full transition-all duration-700'" [style.width.%]="item.pct"></div>
                  </div>
                  <span class="text-sm font-bold text-gray-800 dark:text-white w-8 text-right flex-shrink-0 tabular-nums">{{ item.value }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Nav -->
        <div>
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Access</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            @for (link of quickLinks; track link.label) {
              <a [routerLink]="link.route"
                 class="card p-4 flex items-center gap-3 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all group cursor-pointer no-underline">
                <div [class]="link.iconBg + ' w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0'">
                  <ng-icon [name]="link.iconName" size="16" [class]="link.iconColor" />
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">{{ link.label }}</span>
              </a>
            }
          </div>
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
    { iconName: 'lucideUtensils',      iconColor: 'text-amber-600',  iconBg: 'bg-amber-50 dark:bg-amber-900/20',   label: 'Menu Items',    route: '/menu' },
    { iconName: 'lucideChefHat',       iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-900/20', label: 'Chefs',         route: '/chefs' },
    { iconName: 'lucideBell',          iconColor: 'text-blue-600',   iconBg: 'bg-blue-50 dark:bg-blue-900/20',     label: 'Subscriptions', route: '/subscriptions' },
    { iconName: 'lucideBarChart2',     iconColor: 'text-green-600',  iconBg: 'bg-green-50 dark:bg-green-900/20',   label: 'Analytics',     route: '/stats' },
  ];

  breakdown() {
    const s = this.stats();
    if (!s) return [];
    const total = s.menuItemCount + s.chefCount + s.subscriptionCount + s.blogPostCount + s.testimonialCount || 1;
    return [
      { icon: 'lucideUtensils',    textColor: 'text-amber-500',  label: 'Menu',    value: s.menuItemCount,    pct: (s.menuItemCount / total) * 100,    color: 'bg-amber-400' },
      { icon: 'lucideChefHat',     textColor: 'text-orange-500', label: 'Chefs',   value: s.chefCount,         pct: (s.chefCount / total) * 100,         color: 'bg-orange-400' },
      { icon: 'lucideBell',        textColor: 'text-blue-500',   label: 'Subs',    value: s.subscriptionCount, pct: (s.subscriptionCount / total) * 100, color: 'bg-blue-400' },
      { icon: 'lucideFileText',    textColor: 'text-green-500',  label: 'Blog',    value: s.blogPostCount,     pct: (s.blogPostCount / total) * 100,     color: 'bg-green-400' },
      { icon: 'lucideStar',        textColor: 'text-purple-500', label: 'Reviews', value: s.testimonialCount,  pct: (s.testimonialCount / total) * 100,  color: 'bg-purple-400' },
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
