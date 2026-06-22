import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark = signal(localStorage.getItem('gm_theme') === 'dark');
  readonly isDark = this._dark.asReadonly();

  constructor() {
    this.apply(this._dark());
  }

  toggle(): void {
    const next = !this._dark();
    this._dark.set(next);
    localStorage.setItem('gm_theme', next ? 'dark' : 'light');
    this.apply(next);
  }

  private apply(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
    document.body.classList.toggle('dark', dark);
  }
}
