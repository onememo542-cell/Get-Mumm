import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

interface NavItem { icon: string; label: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Overlay (mobile) -->
    <div *ngIf="open" class="fixed inset-0 bg-black/50 z-20 lg:hidden" (click)="close.emit()"></div>

    <!-- Sidebar -->
    <aside [class.translate-x-0]="open" [class.-translate-x-full]="!open"
           class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30 flex flex-col transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto">

      <!-- Brand -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div class="w-9 h-9 bg-mumm-orange rounded-xl flex items-center justify-center text-white text-lg font-bold">G</div>
        <div>
          <p class="font-bold text-gray-900 dark:text-white text-sm">Get Mumm</p>
          <p class="text-xs text-gray-400">Admin Panel</p>
        </div>
        <button class="ml-auto lg:hidden text-gray-400 hover:text-gray-600" (click)="close.emit()">✕</button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route" routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-semibold"
             [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors mb-0.5"
             (click)="close.emit()">
            <span class="text-lg w-6 text-center">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>

      <!-- User -->
      <div class="p-4 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ auth.user()?.username }}</p>
            <p class="text-xs text-gray-400">{{ auth.user()?.role }}</p>
          </div>
          <button (click)="auth.logout()" title="Logout"
                  class="text-gray-400 hover:text-red-500 transition-colors text-lg">⏏</button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  auth = inject(AuthService);

  navItems: NavItem[] = [
    { icon: '🏠', label: 'Dashboard',     route: '/dashboard' },
    { icon: '🍽️', label: 'Menu Items',    route: '/menu' },
    { icon: '📋', label: 'Orders',         route: '/orders' },
    { icon: '👨‍🍳', label: 'Chefs',         route: '/chefs' },
    { icon: '📝', label: 'Blog',           route: '/blog' },
    { icon: '🔔', label: 'Subscriptions', route: '/subscriptions' },
    { icon: '⭐', label: 'Testimonials',  route: '/testimonials' },
    { icon: '📊', label: 'Analytics',     route: '/stats' },
    { icon: '⚙️', label: 'Settings',      route: '/settings' },
  ];
}
