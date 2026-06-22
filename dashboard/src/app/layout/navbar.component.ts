import { Component, inject, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';
import { LanguageService } from '../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent, TranslatePipe],
  template: `
    <header class="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800
                   flex items-center px-4 md:px-6 gap-3 flex-shrink-0 sticky top-0 z-10">

      <!-- Hamburger -->
      <button class="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              (click)="menuOpen.emit()" aria-label="Open navigation" aria-controls="main-sidebar">
        <ng-icon name="lucideMenu" size="20" />
      </button>

      <!-- Mobile brand -->
      <div class="lg:hidden flex items-center gap-2 flex-shrink-0">
        <div class="w-7 h-7 bg-mumm-orange rounded-lg flex items-center justify-center text-white text-sm font-bold">G</div>
        <span class="text-sm font-bold text-gray-800 dark:text-white">Get Mumm</span>
      </div>

      <!-- Desktop page label -->
      <div class="hidden lg:block flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Dashboard</p>
      </div>
      <div class="flex-1 lg:hidden"></div>

      <!-- Right actions -->
      <div class="flex items-center gap-1 flex-shrink-0">

        <!-- Language toggle -->
        <button (click)="lang.toggle()"
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm font-semibold
                       text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
                       border border-gray-200 dark:border-gray-700 transition-colors"
                [attr.aria-label]="'LANG.SWITCH_LABEL' | translate">
          <ng-icon name="lucideLanguages" size="15" />
          <span class="text-xs tracking-wide">{{ 'LANG.CURRENT' | translate }}</span>
        </button>

        <!-- Dark mode -->
        <button (click)="theme.toggle()"
                class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ms-1"
                [attr.aria-label]="theme.isDark() ? ('COMMON.DARK_MODE_ON' | translate) : ('COMMON.DARK_MODE_OFF' | translate)">
          @if (theme.isDark()) {
            <ng-icon name="lucideSun" size="18" />
          } @else {
            <ng-icon name="lucideMoon" size="18" />
          }
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1"></div>

        <!-- User chip -->
        <div class="flex items-center gap-2">
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
  lang  = inject(LanguageService);
}
