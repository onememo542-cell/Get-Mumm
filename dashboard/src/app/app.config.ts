import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIcons } from '@ng-icons/core';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { EN, AR } from './core/services/translations';
import {
  lucideLayoutDashboard, lucideUtensils, lucideClipboardList,
  lucideChefHat, lucideFileText, lucideBell, lucideStar,
  lucideBarChart2, lucideSettings, lucideRefreshCw, lucideSearch,
  lucideX, lucidePlus, lucideTrash2, lucideLogOut, lucideSun, lucideMoon,
  lucideMenu, lucideAlertTriangle, lucideInfo, lucideCheckCircle2,
  lucideXCircle, lucideDatabase, lucideActivity, lucideLoader, lucideEye,
  lucideChevronRight, lucideArrowRight, lucideShield, lucidePackage,
  lucideUsers, lucideTrendingUp, lucideHeart, lucideNewspaper,
  lucideCalendar, lucideUser, lucideLock, lucideWifi, lucideWifiOff,
  lucideServer, lucideGlobe, lucideZap, lucideLanguages,
} from '@ng-icons/lucide';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { retryInterceptor } from './core/interceptors/retry.interceptor';

const TRANSLATIONS: Record<string, object> = { en: EN, ar: AR };

class InlineTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<object> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['en']);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, retryInterceptor])),
    provideTranslateService({
      loader: { provide: TranslateLoader, useClass: InlineTranslateLoader },
      defaultLanguage: 'en',
    }),
    provideIcons({
      lucideLayoutDashboard, lucideUtensils, lucideClipboardList,
      lucideChefHat, lucideFileText, lucideBell, lucideStar,
      lucideBarChart2, lucideSettings, lucideRefreshCw, lucideSearch,
      lucideX, lucidePlus, lucideTrash2, lucideLogOut, lucideSun, lucideMoon,
      lucideMenu, lucideAlertTriangle, lucideInfo, lucideCheckCircle2,
      lucideXCircle, lucideDatabase, lucideActivity, lucideLoader, lucideEye,
      lucideChevronRight, lucideArrowRight, lucideShield, lucidePackage,
      lucideUsers, lucideTrendingUp, lucideHeart, lucideNewspaper,
      lucideCalendar, lucideUser, lucideLock, lucideWifi, lucideWifiOff,
      lucideServer, lucideGlobe, lucideZap, lucideLanguages,
    }),
  ],
};
