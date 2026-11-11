import { DOCUMENT, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeCa from '@angular/common/locales/ca';
import {
  ApplicationConfig,
  ErrorHandler,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import {
  TranslateService,
  provideTranslateCompiler,
  provideTranslateService,
} from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { POCKETBASE_INSTANCE, pocketBaseFactory } from '@plastik/core/api-pocketbase';
import { providePocketBaseWithTranslationsEnv } from '@plastik/core/environments';
import { provideMatThemeColors } from '@plastik/shared/mat-theme-toggle';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { provideNotificationConfig } from '@plastik/shared/notification/entities';
import { TranslateFormatJsCompiler } from 'ngx-translate-formatjs-compiler';
import { firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { EcoAdminTitleStrategy } from './eco-admin-title.strategy';
import { resolveInitialLanguage } from './initial-language';

registerLocaleData(localeCa);

const MAX_CONCURRENT_NOTIFICATIONS = 3;

const initialLanguage = resolveInitialLanguage(environment.languages, environment.defaultLanguage);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withViewTransitions({ skipInitialTransition: true }),
      withComponentInputBinding(),
      withExperimentalAutoCleanupInjectors(),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })
    ),
    providePocketBaseWithTranslationsEnv(environment),
    provideHttpClient(withFetch()),
    provideNotificationConfig({ maxConcurrent: MAX_CONCURRENT_NOTIFICATIONS }),
    // usePopover: false — hot-toast v6 defaults to a native-popover container that stays
    // `display: none` without zones, so the toasts would never show.
    provideHotToastConfig({
      visibleToasts: MAX_CONCURRENT_NOTIFICATIONS,
      stacking: 'vertical',
      usePopover: false,
    }),
    { provide: POCKETBASE_INSTANCE, useFactory: pocketBaseFactory },
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
      compiler: provideTranslateCompiler(TranslateFormatJsCompiler),
      fallbackLang: environment.defaultLanguage,
      lang: initialLanguage,
    }),
    provideAppInitializer(async () => {
      const translate = inject(TranslateService);
      const document = inject(DOCUMENT);

      document.documentElement.lang = initialLanguage;

      try {
        // The first screen waits for its texts, so no translation key is ever painted.
        await firstValueFrom(translate.use(initialLanguage));
      } catch {
        // A translation file that fails to load is reported through ErrorHandlerService.
      }
    }),
    { provide: LOCALE_ID, useValue: 'ca' },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: TitleStrategy, useExisting: EcoAdminTitleStrategy },
    { provide: MAT_ICON_DEFAULT_OPTIONS, useValue: { fontSet: 'material-symbols-outlined' } },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    // The page background of the admin mocks, written to `theme-color` when the theme changes.
    // The pre-paint script in index.html and `--eco-admin-page-background` repeat the same pair.
    provideMatThemeColors({ light: '#f2f5ea', dark: '#11140e' }),
  ],
};
