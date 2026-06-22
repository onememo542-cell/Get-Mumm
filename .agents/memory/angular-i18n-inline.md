---
name: Angular 18 i18n inline loader
description: ngx-translate HTTP loader fails in dev with Angular 18 app builder; use inline object loader instead
---

**Rule:** When using `@ngx-translate/core` with the Angular 18 `@angular-devkit/build-angular:application` builder, do NOT use `TranslateHttpLoader`. Use a custom inline loader that returns `Observable.of(translations)` from a TypeScript object.

**Why:** The Angular 18 app builder serves static assets from the `public/` directory at the project root, not from `src/assets/`. Even after copying i18n JSON files to `public/assets/i18n/`, the dev server returns 404 for those paths. An inline loader bypasses HTTP entirely and loads synchronously.

**How to apply:**
```ts
// translations.ts — flat TS objects for EN and AR
export const EN = { NAV: { DASHBOARD: 'Dashboard', ... }, ... };
export const AR = { NAV: { DASHBOARD: 'لوحة التحكم', ... }, ... };

// app.config.ts
const TRANSLATIONS: Record<string, object> = { en: EN, ar: AR };

class InlineTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<object> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['en']);
  }
}

provideTranslateService({
  loader: { provide: TranslateLoader, useClass: InlineTranslateLoader },
  defaultLanguage: 'en',
})
```

Components import `TranslatePipe` from `@ngx-translate/core` and use `{{ 'KEY.SUBKEY' | translate }}` in templates.
