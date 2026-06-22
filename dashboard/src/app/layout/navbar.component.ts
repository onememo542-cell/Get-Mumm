import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-3 md:px-4 gap-3 flex-shrink-0 sticky top-0 z-10">
      <!-- Hamburger (mobile) -->
      <button class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
              (click)="menuOpen.emit()"
              aria-label="Open navigation menu"
              aria-controls="main-sidebar">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Brand (mobile only) -->
      <div class="lg:hidden flex items-center gap-2 flex-shrink-0">
        <div class="w-7 h-7 bg-mumm-orange rounded-lg flex items-center justify-center text-white text-sm font-bold" aria-hidden="true">G</div>
        <span class="text-sm font-bold text-gray-800 dark:text-white">Get Mumm</span>
      </div>

      <div class="hidden lg:block flex-1">
        <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Admin Dashboard</h1>
      </div>
      <div class="flex-1 lg:hidden"></div>

      <!-- Right actions -->
      <div class="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <!-- Dark mode -->
        <button (click)="theme.toggle()"
                class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
                [attr.title]="theme.isDark() ? 'Light mode' : 'Dark mode'">
          @if (theme.isDark()) {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          } @else {
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          }
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block" aria-hidden="true"></div>

        <!-- User chip -->
        <div class="flex items-center gap-2 pl-1">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
               [attr.aria-label]="'Signed in as ' + auth.user()?.username">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="hidden sm:block">
            <p class="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-tight">{{ auth.user()?.username }}</p>
            <p class="text-xs text-gray-400 leading-tight">{{ auth.user()?.role }}</p>
          </div>
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
