import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NgIconComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-mumm-orange to-amber-700 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">

        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-mumm-orange rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4">G</div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ 'AUTH.TITLE' | translate }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ 'AUTH.SUBTITLE' | translate }}</p>
        </div>

        <!-- Lang toggle on login page -->
        <div class="flex justify-center mb-6">
          <button (click)="lang.toggle()"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold
                         text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300
                         dark:text-gray-400 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
            <ng-icon name="lucideLanguages" size="13" />
            {{ 'LANG.CURRENT' | translate }}
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="mb-4">
            <label class="label">{{ 'AUTH.USERNAME' | translate }}</label>
            <input type="text" class="input" [(ngModel)]="username" name="username" required placeholder="admin"
                   autocomplete="username" />
          </div>
          <div class="mb-6">
            <label class="label">{{ 'AUTH.PASSWORD' | translate }}</label>
            <input type="password" class="input" [(ngModel)]="password" name="password" required placeholder="••••••••"
                   autocomplete="current-password" />
          </div>

          @if (error()) {
            <div class="mb-4 flex items-start gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100" role="alert">
              <ng-icon name="lucideAlertTriangle" size="14" class="flex-shrink-0 mt-0.5" />
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn-primary w-full justify-center py-3 text-base gap-2" [disabled]="loading()">
            @if (loading()) {
              <ng-icon name="lucideLoader" size="16" class="animate-spin" />
              {{ 'AUTH.SIGNING_IN' | translate }}
            } @else {
              {{ 'AUTH.SIGN_IN' | translate }}
            }
          </button>
        </form>

        <p class="text-center text-xs text-gray-400 mt-6">Get Mumm © {{ year }} — Admin Panel</p>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  auth     = inject(AuthService);
  router   = inject(Router);
  lang     = inject(LanguageService);
  username = '';
  password = '';
  loading  = signal(false);
  error    = signal('');
  year     = new Date().getFullYear();

  ngOnInit(): void {}

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.username, this.password);
      this.loading.set(false);
      if (ok) this.router.navigate(['/dashboard']);
      else this.error.set(this.lang.lang() === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة.' : 'Invalid username or password.');
    }, 400);
  }
}
