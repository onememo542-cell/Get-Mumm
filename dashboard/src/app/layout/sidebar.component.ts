import {
  Component, inject, Input, Output, EventEmitter,
  ChangeDetectionStrategy, HostListener,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../core/services/auth.service';
import { LanguageService } from '../core/services/language.service';

interface NavItem { iconName: string; labelKey: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgIconComponent, TranslatePipe],
  template: `
    <!-- Backdrop -->
    @if (open) {
      <div class="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
           (click)="close.emit()" role="button" aria-label="Close sidebar" tabindex="-1"></div>
    }

    <aside id="main-sidebar" role="navigation" [attr.aria-label]="'NAV.DASHBOARD' | translate"
           [attr.aria-hidden]="!open"
           class="fixed top-0 h-full w-64 bg-white dark:bg-gray-900
                  border-e border-gray-100 dark:border-gray-800
                  z-30 flex flex-col
                  transition-transform duration-300 ease-in-out will-change-transform
                  ltr:left-0 rtl:right-0
                  lg:translate-x-0 lg:static lg:z-auto"
           [class.translate-x-0]="open"
           [class.ltr:-translate-x-full]="!open"
           [class.rtl:translate-x-full]="!open">

      <!-- Brand -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div class="w-9 h-9 bg-mumm-orange rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">G</div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-gray-900 dark:text-white text-sm leading-tight">Get Mumm</p>
          <p class="text-xs text-gray-400 leading-tight">{{ 'NAV.ADMIN_PANEL' | translate }}</p>
        </div>
        <button class="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                (click)="close.emit()" [attr.aria-label]="'NAV.CLOSE' | translate">
          <ng-icon name="lucideX" size="16" />
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-3 px-3">
        @for (item of navItems; track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 font-semibold"
             [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
             class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400
                    hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
                    transition-colors mb-0.5 group outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
             (click)="close.emit()" [attr.aria-label]="item.labelKey | translate">
            <ng-icon [name]="item.iconName" size="17" class="flex-shrink-0 opacity-75 group-hover:opacity-100 transition-opacity" />
            <span class="flex-1 truncate">{{ item.labelKey | translate }}</span>
          </a>
        }
      </nav>

      <!-- User Footer -->
      <div class="p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {{ auth.user()?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate leading-tight">{{ auth.user()?.username }}</p>
            <p class="text-xs text-gray-400 leading-tight capitalize">{{ auth.user()?.role }}</p>
          </div>
          <button (click)="auth.logout()" [attr.aria-label]="'COMMON.SIGN_OUT' | translate"
                  class="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <ng-icon name="lucideLogOut" size="15" />
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
  lang = inject(LanguageService);

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.open) this.close.emit(); }

  readonly navItems: NavItem[] = [
    { iconName: 'lucideLayoutDashboard', labelKey: 'NAV.DASHBOARD',     route: '/dashboard' },
    { iconName: 'lucideUtensils',        labelKey: 'NAV.MENU',          route: '/menu' },
    { iconName: 'lucideClipboardList',   labelKey: 'NAV.ORDERS',        route: '/orders' },
    { iconName: 'lucideChefHat',         labelKey: 'NAV.CHEFS',         route: '/chefs' },
    { iconName: 'lucideFileText',        labelKey: 'NAV.BLOG',          route: '/blog' },
    { iconName: 'lucideBell',            labelKey: 'NAV.SUBSCRIPTIONS', route: '/subscriptions' },
    { iconName: 'lucideStar',            labelKey: 'NAV.TESTIMONIALS',  route: '/testimonials' },
    { iconName: 'lucideBarChart2',       labelKey: 'NAV.ANALYTICS',     route: '/stats' },
    { iconName: 'lucideSettings',        labelKey: 'NAV.SETTINGS',      route: '/settings' },
  ];
}
