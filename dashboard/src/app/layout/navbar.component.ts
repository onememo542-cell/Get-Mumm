import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 gap-4">
      <button class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              (click)="menuOpen.emit()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <div class="flex-1">
        <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Get Mumm — Admin Dashboard</h1>
      </div>

      <!-- Dark mode toggle -->
      <button (click)="theme.toggle()"
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
              [title]="theme.isDark() ? 'Light mode' : 'Dark mode'">
        {{ theme.isDark() ? '☀️' : '🌙' }}
      </button>

      <!-- Avatar -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
          {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  @Output() menuOpen = new EventEmitter<void>();
  theme = inject(ThemeService);
  auth  = inject(AuthService);
}
