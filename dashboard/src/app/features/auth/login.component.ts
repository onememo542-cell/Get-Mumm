import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent } from '@ng-icons/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, NgIconComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-mumm-orange to-amber-700 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-mumm-orange rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-3">G</div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Get Mumm</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin Dashboard</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" #f="ngForm">
          <div class="mb-4">
            <label class="label">Username</label>
            <input type="text" class="input" [(ngModel)]="username" name="username" required placeholder="admin" />
          </div>
          <div class="mb-6">
            <label class="label">Password</label>
            <input type="password" class="input" [(ngModel)]="password" name="password" required placeholder="••••••••" />
          </div>

          @if (error()) {
            <div class="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn-primary w-full justify-center py-3 text-base gap-2" [disabled]="loading()">
            @if (loading()) { <ng-icon name="lucideLoader" size="16" class="animate-spin" /> }
            Sign In
          </button>
        </form>

        <p class="text-center text-xs text-gray-400 mt-6">Get Mumm © {{ year }} — Admin Panel</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth    = inject(AuthService);
  router  = inject(Router);
  username = '';
  password = '';
  loading  = signal(false);
  error    = signal('');
  year     = new Date().getFullYear();

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.auth.login(this.username, this.password);
      this.loading.set(false);
      if (ok) this.router.navigate(['/dashboard']);
      else this.error.set('Invalid username or password.');
    }, 400);
  }
}
