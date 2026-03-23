import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';

import { IMAGE_LOADER } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslateCompiler, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { POCKETBASE_INSTANCE, pocketBaseFactory } from '@plastik/core/api-pocketbase';
import { providePocketBaseWithTranslationsEnv } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { ecoStoreTenantStore, provideEcoStoreTenant } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';
import { provideMatThemeColors } from '@plastik/shared/mat-theme-toggle';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import { TranslateFormatJsCompiler } from 'ngx-translate-formatjs-compiler';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

registerLocaleData(localeCa);
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
      withComponentInputBinding(),
      withExperimentalAutoCleanupInjectors(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    providePocketBaseWithTranslationsEnv(environment),
    provideHttpClient(withFetch()),
    provideMatThemeColors({ light: '#f8faf0', dark: '#11140f' }),
    { provide: POCKETBASE_INSTANCE, useFactory: pocketBaseFactory },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      compiler: provideTranslateCompiler(TranslateFormatJsCompiler),
      fallbackLang: environment.defaultLanguage,
      lang: environment.defaultLanguage,
    }),
    provideEcoStoreTenant,
    provideAppInitializer(async () => {
      inject(activityStore).setActivity(true);
      await inject(ecoStoreTenantStore).getTenant();
    }),
    { provide: LOCALE_ID, useValue: 'ca' },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: TitleStrategy, useClass: PrefixTitleService },
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.environment === 'production' || environment.environment === 'staging',
      registrationStrategy: 'registerImmediately',
    }),
    {
      provide: IMAGE_LOADER,
      useValue: pocketBaseStorageLoader(environment.baseApiUrl),
    },
  ],
};
