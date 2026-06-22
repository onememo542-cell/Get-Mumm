import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { StatsDto } from '../../models';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { LoadingComponent } from '../../shared/components/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, LoadingComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with Get Mumm.</p>
      </div>

      @if (loading()) {
        <app-loading />
      } @else if (stats()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <app-stat-card icon="🍽️" label="Menu Items"     [value]="stats()!.menuItemCount"    iconBg="bg-amber-50 dark:bg-amber-900/20" />
          <app-stat-card icon="👨‍🍳" label="Active Chefs"   [value]="stats()!.chefCount"         iconBg="bg-orange-50 dark:bg-orange-900/20" />
          <app-stat-card icon="🔔" label="Subscriptions" [value]="stats()!.subscriptionCount" iconBg="bg-blue-50 dark:bg-blue-900/20" />
          <app-stat-card icon="📝" label="Blog Posts"    [value]="stats()!.blogPostCount"     iconBg="bg-green-50 dark:bg-green-900/20" />
          <app-stat-card icon="⭐" label="Testimonials"  [value]="stats()!.testimonialCount"  iconBg="bg-purple-50 dark:bg-purple-900/20" />
        </div>

        <!-- Health + Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- System Health -->
          <div class="card p-6">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">System Health</h3>
            @if (health()) {
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                  <span class="text-sm text-gray-600 dark:text-gray-400">API Status</span>
                  <span class="badge" [class]="health()!.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ health()!.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <span class="badge" [class]="health()!.databaseConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ health()!.databaseConnected ? 'Connected' : 'Disconnected' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="text-sm text-gray-600 dark:text-gray-400">Last Check</span>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ health()!.timestamp | date:'medium' }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Quick Overview -->
          <div class="card p-6">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Platform Overview</h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div class="bg-primary-500 h-2 rounded-full" [style.width.%]="menuPct()"></div>
                </div>
                <span class="text-xs text-gray-500 w-24">Menu Items ({{ stats()!.menuItemCount }})</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div class="bg-orange-500 h-2 rounded-full" [style.width.%]="chefPct()"></div>
                </div>
                <span class="text-xs text-gray-500 w-24">Chefs ({{ stats()!.chefCount }})</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" [style.width.%]="subPct()"></div>
                </div>
                <span class="text-xs text-gray-500 w-24">Subscriptions ({{ stats()!.subscriptionCount }})</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" [style.width.%]="blogPct()"></div>
                </div>
                <span class="text-xs text-gray-500 w-24">Blog Posts ({{ stats()!.blogPostCount }})</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  loading = signal(true);
  stats   = signal<StatsDto | null>(null);
  health  = signal<any>(null);

  menuPct() { const s = this.stats(); if (!s) return 0; const max = Math.max(s.menuItemCount, s.chefCount, s.subscriptionCount, s.blogPostCount, 1); return (s.menuItemCount / max) * 100; }
  chefPct() { const s = this.stats(); if (!s) return 0; const max = Math.max(s.menuItemCount, s.chefCount, s.subscriptionCount, s.blogPostCount, 1); return (s.chefCount / max) * 100; }
  subPct()  { const s = this.stats(); if (!s) return 0; const max = Math.max(s.menuItemCount, s.chefCount, s.subscriptionCount, s.blogPostCount, 1); return (s.subscriptionCount / max) * 100; }
  blogPct() { const s = this.stats(); if (!s) return 0; const max = Math.max(s.menuItemCount, s.chefCount, s.subscriptionCount, s.blogPostCount, 1); return (s.blogPostCount / max) * 100; }

  ngOnInit(): void {
    this.api.getStats().subscribe({ next: s => { this.stats.set(s); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.api.getHealth().subscribe({ next: h => this.health.set(h), error: () => {} });
  }
}
