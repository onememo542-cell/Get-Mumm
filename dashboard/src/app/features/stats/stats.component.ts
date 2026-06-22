import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { StatsDto } from '../../models';
import { LoadingComponent } from '../../shared/components/loading.component';
import { StatCardComponent } from '../../shared/components/stat-card.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, LoadingComponent, StatCardComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Platform-wide statistics and insights</p>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (stats()) {
        <!-- Stat grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-stat-card icon="🍽️" label="Total Menu Items"    [value]="stats()!.menuItemCount"    sub="Active items on the platform"    iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <app-stat-card icon="👨‍🍳" label="Total Chefs"         [value]="stats()!.chefCount"         sub="Certified home cooks"             iconBg="bg-orange-50 dark:bg-orange-900/20" />
          <app-stat-card icon="🔔" label="Subscriptions"       [value]="stats()!.subscriptionCount" sub="Active meal subscriptions"        iconBg="bg-blue-50 dark:bg-blue-900/20" />
          <app-stat-card icon="📝" label="Blog Posts"          [value]="stats()!.blogPostCount"     sub="Published articles"               iconBg="bg-green-50 dark:bg-green-900/20" />
          <app-stat-card icon="⭐" label="Testimonials"        [value]="stats()!.testimonialCount"  sub="Customer reviews"                 iconBg="bg-purple-50 dark:bg-purple-900/20" />
          <app-stat-card icon="📊" label="Total Content Items" [value]="totalContent()"             sub="All items combined"               iconBg="bg-rose-50 dark:bg-rose-900/20" />
        </div>

        <!-- Content breakdown bars -->
        <div class="card p-6">
          <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-6">Content Breakdown</h3>
          <div class="space-y-5">
            @for (item of breakdown(); track item.label) {
              <div class="flex items-center gap-4">
                <span class="text-lg w-7">{{ item.icon }}</span>
                <div class="w-28 text-sm text-gray-600 dark:text-gray-400 truncate">{{ item.label }}</div>
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-3">
                  <div [style.width.%]="item.pct" [class]="item.color + ' h-3 rounded-full transition-all duration-700'"></div>
                </div>
                <span class="text-sm font-bold text-gray-800 dark:text-white w-12 text-right">{{ item.value }}</span>
                <span class="text-xs text-gray-400 w-10 text-right">{{ item.pct | number:'1.0-0' }}%</span>
              </div>
            }
          </div>
        </div>

        <!-- Health -->
        @if (health()) {
          <div class="card p-6">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">System Health</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="text-center p-4 rounded-xl" [class]="health()!.status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <p class="text-2xl mb-1">{{ health()!.status === 'Healthy' ? '✅' : '❌' }}</p>
                <p class="text-xs font-semibold" [class]="health()!.status === 'Healthy' ? 'text-green-700 dark:text-green-400' : 'text-red-700'">API Status</p>
                <p class="text-sm font-bold mt-1" [class]="health()!.status === 'Healthy' ? 'text-green-800 dark:text-green-300' : 'text-red-800'">{{ health()!.status }}</p>
              </div>
              <div class="text-center p-4 rounded-xl" [class]="health()!.databaseConnected ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'">
                <p class="text-2xl mb-1">{{ health()!.databaseConnected ? '🟢' : '🔴' }}</p>
                <p class="text-xs font-semibold text-green-700 dark:text-green-400">Database</p>
                <p class="text-sm font-bold mt-1 text-green-800 dark:text-green-300">{{ health()!.databaseConnected ? 'Connected' : 'Offline' }}</p>
              </div>
              <div class="text-center p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 col-span-2">
                <p class="text-2xl mb-1">🕐</p>
                <p class="text-xs font-semibold text-blue-700 dark:text-blue-400">Last Health Check</p>
                <p class="text-xs font-medium mt-1 text-blue-800 dark:text-blue-300">{{ health()!.timestamp | date:'medium' }}</p>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class StatsComponent implements OnInit {
  private api = inject(ApiService);
  loading = signal(true);
  stats   = signal<StatsDto | null>(null);
  health  = signal<any>(null);

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

  ngOnInit(): void {
    this.api.getStats().subscribe({ next: s => { this.stats.set(s); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.api.getHealth().subscribe({ next: h => this.health.set(h), error: () => {} });
  }
}
