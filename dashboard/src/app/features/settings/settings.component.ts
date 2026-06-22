import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgIconComponent, TranslatePipe],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ 'SETTINGS.TITLE' | translate }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ 'SETTINGS.SUBTITLE' | translate }}</p>
      </div>

      <!-- Profile -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideUser" size="15" class="text-gray-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ 'SETTINGS.PROFILE' | translate }}</h3>
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
          {{ 'SETTINGS.PROFILE_NOTE' | translate }}
        </div>
      </div>

      <!-- Language -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideLanguages" size="15" class="text-gray-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Language / اللغة</h3>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <ng-icon name="lucideLanguages" size="20" class="text-blue-500" />
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ lang.lang() === 'en' ? 'English' : 'العربية' }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ lang.lang() === 'en' ? 'Left-to-right (LTR)' : 'من اليمين إلى اليسار (RTL)' }}
              </p>
            </div>
          </div>
          <button (click)="lang.toggle()"
                  class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
                         text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <ng-icon name="lucideLanguages" size="15" />
            {{ 'LANG.CURRENT' | translate }}
          </button>
        </div>
      </div>

      <!-- Appearance -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideSun" size="15" class="text-gray-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ 'SETTINGS.APPEARANCE' | translate }}</h3>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <ng-icon [name]="theme.isDark() ? 'lucideMoon' : 'lucideSun'" size="20"
                     [class]="theme.isDark() ? 'text-indigo-500' : 'text-amber-500'" />
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ 'COMMON.DARK_MODE' | translate }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ theme.isDark() ? ('COMMON.DARK_MODE_ON' | translate) : ('COMMON.DARK_MODE_OFF' | translate) }}</p>
            </div>
          </div>
          <button (click)="theme.toggle()" role="switch" [attr.aria-checked]="theme.isDark()"
                  class="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex-shrink-0"
                  [class]="theme.isDark() ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  [attr.aria-label]="theme.isDark() ? ('COMMON.DARK_MODE_ON' | translate) : ('COMMON.DARK_MODE_OFF' | translate)">
            <span class="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300"
                  [class]="theme.isDark() ? 'translate-x-7' : 'translate-x-1'"></span>
          </button>
        </div>
      </div>

      <!-- Backend Info -->
      <div class="card p-6">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideServer" size="15" class="text-gray-500" />
          <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ 'SETTINGS.BACKEND' | translate }}</h3>
        </div>
        <div class="space-y-0">
          @for (row of backendInfo; track row.labelKey; let last = $last) {
            <div class="flex items-center justify-between py-3"
                 [class.border-b]="!last" [class.border-gray-50]="!last" [class.dark:border-gray-800]="!last">
              <div class="flex items-center gap-2">
                <ng-icon [name]="row.icon" size="13" class="text-gray-400" />
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ row.labelKey | translate }}</span>
              </div>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300 font-mono">{{ row.value }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Danger -->
      <div class="card p-6 border-red-100 dark:border-red-900/30">
        <div class="flex items-center gap-2 mb-5">
          <ng-icon name="lucideShield" size="15" class="text-red-500" />
          <h3 class="text-xs font-semibold text-red-500 uppercase tracking-widest">{{ 'SETTINGS.DANGER' | translate }}</h3>
        </div>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ 'SETTINGS.SIGN_OUT_LABEL' | translate }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ 'SETTINGS.SIGN_OUT_DESC' | translate }}</p>
          </div>
          <button class="btn-danger gap-2 flex-shrink-0" (click)="auth.logout()">
            <ng-icon name="lucideLogOut" size="14" />
            {{ 'COMMON.SIGN_OUT' | translate }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  theme = inject(ThemeService);
  auth  = inject(AuthService);
  lang  = inject(LanguageService);

  readonly backendInfo = [
    { icon: 'lucideGlobe',    labelKey: 'SETTINGS.API_URL',   value: '/api (proxied)' },
    { icon: 'lucideServer',   labelKey: 'SETTINGS.PORT',      value: '8080' },
    { icon: 'lucideZap',      labelKey: 'SETTINGS.FRAMEWORK', value: 'ASP.NET Core 8' },
    { icon: 'lucideDatabase', labelKey: 'SETTINGS.DATABASE',  value: 'PostgreSQL (Supabase)' },
  ];
}
