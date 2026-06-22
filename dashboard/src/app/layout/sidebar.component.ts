import {
  Component, inject, Input, Output, EventEmitter,
  ChangeDetectionStrategy, HostListener,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

interface NavItem { icon: string; label: string; route: string; badge?: number; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Backdrop (mobile) -->
    @if (open) {
      <div class="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
           (click)="close.emit()"
           role="button"
           aria-label="Close sidebar"
           tabindex="-1"></div>
    }

    <!-- Sidebar -->
    <aside
      id="main-sidebar"
      role="navigation"
      aria-label="Main navigation"
      [attr.aria-hidden]="!open && isMobile"
      class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30 flex flex-col transform transition-transform duration-300 ease-in-out will-change-transform lg:translate-x-0 lg:static lg:z-auto"
      [class.translate-x-0]="open"
      [class.-translate-x-full]="!open">

      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div class="w-9 h-9 bg-mumm-orange rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
             aria-hidden="true">G</div>
        <div class="min-w-0">
          <p class="font-bold text-gray-900 dark:text-white text-sm leading-tight">Get Mumm</p>
          <p class="text-xs text-gray-400 leading-tight">Admin Panel</p>
        </div>
        <button class="ml-auto lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                (click)="close.emit()"
                aria-label="Close navigation">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 overflow-y-auto py-3 px-2 scrollbar-thin" aria-label="Dashboard sections">
        <p class="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Navigation</p>
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-semibold"
             [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors mb-0.5 group outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
             (click)="close.emit()"
             [attr.aria-label]="item.label">
            <span class="text-base w-5 text-center flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">{{ item.icon }}</span>
            <span class="flex-1 truncate">{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- User Footer -->
      <div class="p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
               aria-hidden="true">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{{ auth.user()?.username }}</p>
            <p class="text-xs text-gray-400 leading-tight">{{ auth.user()?.role }}</p>
          </div>
          <button (click)="auth.logout()"
                  aria-label="Sign out"
                  title="Sign out"
                  class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  auth = inject(AuthService);

  get isMobile(): boolean { return window.innerWidth < 1024; }

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.open) this.close.emit(); }

  readonly navItems: NavItem[] = [
    { icon: '🏠', label: 'Dashboard',     route: '/dashboard' },
    { icon: '🍽️', label: 'Menu Items',    route: '/menu' },
    { icon: '📋', label: 'Orders',         route: '/orders' },
    { icon: '👨‍🍳', label: 'Chefs',          route: '/chefs' },
    { icon: '📝', label: 'Blog',           route: '/blog' },
    { icon: '🔔', label: 'Subscriptions', route: '/subscriptions' },
    { icon: '⭐', label: 'Testimonials',  route: '/testimonials' },
    { icon: '📊', label: 'Analytics',     route: '/stats' },
    { icon: '⚙️', label: 'Settings',      route: '/settings' },
  ];
}
