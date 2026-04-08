import { IMAGE_LOADER, registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import localeCa from '@angular/common/locales/ca';
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
  withInMemoryScrolling,
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
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import { TranslateFormatJsCompiler } from 'ngx-translate-formatjs-compiler';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

// `LOCALE_ID` is fixed to 'ca', so Angular pipes (currency/date/number) only
// ever need the Catalan locale data. The 'es' locale is intentionally not
// registered to keep it out of the initial bundle.
registerLocaleData(localeCa);

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
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    providePocketBaseWithTranslationsEnv(environment),
    provideHttpClient(withFetch()),
    { provide: POCKETBASE_INSTANCE, useFactory: pocketBaseFactory },
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      compiler: provideTranslateCompiler(TranslateFormatJsCompiler),
      fallbackLang: environment.defaultLanguage,
      lang:
        (typeof window !== 'undefined' && localStorage.getItem('eco-lang')) ||
        (typeof window !== 'undefined' && navigator.language.split('-')[0]) ||
        environment.defaultLanguage,
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
