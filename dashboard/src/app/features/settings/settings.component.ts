import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your admin preferences</p>
      </div>

      <!-- Profile card -->
      <div class="card p-6">
        <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Profile</h3>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-lg">{{ auth.user()?.username }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ auth.user()?.role }}</p>
          </div>
        </div>
        <div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
          ℹ️ Profile editing will be available once a backend authentication system is integrated.
        </div>
      </div>

      <!-- Appearance -->
      <div class="card p-6">
        <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Appearance</h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
            <p class="text-xs text-gray-400 mt-0.5">Switch between light and dark theme</p>
          </div>
          <button (click)="theme.toggle()"
                  class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [class]="theme.isDark() ? 'bg-primary-600' : 'bg-gray-200'">
            <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
                  [class]="theme.isDark() ? 'translate-x-7' : 'translate-x-1'"></span>
          </button>
        </div>
      </div>

      <!-- Backend -->
      <div class="card p-6">
        <h3 class="text-base font-semibold text-gray-800 dark:text-white mb-4">Backend Connection</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400">API Base URL</span>
            <span class="font-mono text-gray-700 dark:text-gray-300">/api (proxied)</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800">
            <span class="text-gray-500 dark:text-gray-400">Backend Port</span>
            <span class="font-mono text-gray-700 dark:text-gray-300">8080</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-500 dark:text-gray-400">Framework</span>
            <span class="text-gray-700 dark:text-gray-300">ASP.NET Core 8</span>
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border-red-100 dark:border-red-900/30">
        <h3 class="text-base font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Sign Out</p>
            <p class="text-xs text-gray-400 mt-0.5">End your current admin session</p>
          </div>
          <button class="btn-danger" (click)="auth.logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  theme = inject(ThemeService);
  auth  = inject(AuthService);
  toast = inject(ToastService);
}
