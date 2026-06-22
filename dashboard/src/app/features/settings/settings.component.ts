import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your admin preferences</p>
      </div>

      <!-- Profile -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideUser" size="15" class="text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">Profile</h3>
        </div>
        <div class="flex items-center gap-4 mb-5">
          <div class="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-base">{{ auth.user()?.username }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ auth.user()?.role }}</p>
          </div>
        </div>
        <div class="flex items-start gap-2.5 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <ng-icon name="lucideInfo" size="15" class="flex-shrink-0 mt-0.5" />
          Profile editing will be available once a backend auth system is integrated.
        </div>
      </div>

      <!-- Appearance -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideSun" size="15" class="text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">Appearance</h3>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <ng-icon [name]="theme.isDark() ? 'lucideMoon' : 'lucideSun'" size="20"
                     [class]="theme.isDark() ? 'text-indigo-500' : 'text-amber-500'" />
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ theme.isDark() ? 'Dark theme active' : 'Light theme active' }}</p>
            </div>
          </div>
          <button (click)="theme.toggle()" role="switch" [attr.aria-checked]="theme.isDark()"
                  class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex-shrink-0"
                  [class]="theme.isDark() ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
            <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
                  [class]="theme.isDark() ? 'translate-x-7' : 'translate-x-1'"></span>
          </button>
        </div>
      </div>

      <!-- Backend Info -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideServer" size="15" class="text-gray-500" />
          <h3 class="text-sm font-semibold text-gray-800 dark:text-white uppercase tracking-wide">Backend Connection</h3>
        </div>
        <div class="space-y-0">
          @for (row of backendInfo; track row.label; let last = $last) {
            <div class="flex items-center justify-between py-3" [class.border-b]="!last" [class.border-gray-50]="!last" [class.dark:border-gray-800]="!last">
              <div class="flex items-center gap-2">
                <ng-icon [name]="row.icon" size="13" class="text-gray-400" />
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.label }}</span>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">{{ row.value }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6 border-red-100 dark:border-red-900/30">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideShield" size="15" class="text-red-500" />
          <h3 class="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">Danger Zone</h3>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Sign Out</p>
            <p class="text-xs text-gray-400 mt-0.5">End your current admin session</p>
          </div>
          <button class="btn-danger gap-2 flex-shrink-0" (click)="auth.logout()">
            <ng-icon name="lucideLogOut" size="14" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  theme = inject(ThemeService);
  auth  = inject(AuthService);

  readonly backendInfo = [
    { icon: 'lucideGlobe',    label: 'API Base URL',  value: '/api (proxied)' },
    { icon: 'lucideServer',   label: 'Backend Port',  value: '8080' },
    { icon: 'lucideZap',      label: 'Framework',     value: 'ASP.NET Core 8' },
    { icon: 'lucideDatabase', label: 'Database',      value: 'PostgreSQL (Supabase)' },
  ];
}
