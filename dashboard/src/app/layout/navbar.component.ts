import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent],
  template: `
    <header class="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 md:px-6 gap-3 flex-shrink-0 sticky top-0 z-10">

      <!-- Hamburger -->
      <button class="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              (click)="menuOpen.emit()" aria-label="Open navigation" aria-controls="main-sidebar">
        <ng-icon name="lucideMenu" size="20" />
      </button>

      <!-- Mobile Brand -->
      <div class="lg:hidden flex items-center gap-2.5 flex-shrink-0">
        <div class="w-7 h-7 bg-mumm-orange rounded-lg flex items-center justify-center text-white text-sm font-bold" aria-hidden="true">G</div>
        <span class="text-sm font-bold text-gray-800 dark:text-white">Get Mumm</span>
      </div>

      <!-- Desktop Title -->
      <div class="hidden lg:block flex-1">
        <h1 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Admin Dashboard</h1>
      </div>
      <div class="flex-1 lg:hidden"></div>

      <!-- Right Actions -->
      <div class="flex items-center gap-1 md:gap-2 flex-shrink-0">

        <!-- Dark mode -->
        <button (click)="theme.toggle()"
                class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
          @if (theme.isDark()) {
            <ng-icon name="lucideSun" size="18" />
          } @else {
            <ng-icon name="lucideMoon" size="18" />
          }
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1" aria-hidden="true"></div>

        <!-- User chip -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold"
               [attr.aria-label]="'Signed in as ' + auth.user()?.username">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="hidden sm:block leading-none">
            <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ auth.user()?.username }}</p>
            <p class="text-xs text-gray-400 capitalize mt-0.5">{{ auth.user()?.role }}</p>
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
