import { Injectable, signal, computed, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Lang = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang = signal<Lang>(
    (localStorage.getItem('mumm_lang') as Lang) ?? 'en'
  );

  readonly lang  = this._lang.asReadonly();
  readonly isRtl = computed(() => this._lang() === 'ar');
  readonly dir   = computed(() => (this._lang() === 'ar' ? 'rtl' : 'ltr'));

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const saved = this._lang();
    this.translate.use(saved);
    this._applyDir(saved);

    effect(() => {
      const l = this._lang();
      this.translate.use(l);
      this._applyDir(l);
      localStorage.setItem('mumm_lang', l);
    });
  }

  toggle(): void {
    this._lang.set(this._lang() === 'en' ? 'ar' : 'en');
  }

  private _applyDir(lang: Lang): void {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
