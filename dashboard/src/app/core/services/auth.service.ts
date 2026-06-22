import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '../../models';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'getmumm2024';
const STORAGE_KEY = 'gm_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadUser());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const user: AuthUser = { username, role: 'Admin', token: 'local-admin-token' };
      this._user.set(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem(STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._user()?.token ?? null;
  }

  private loadUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
