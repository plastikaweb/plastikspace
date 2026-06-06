/* eslint-disable no-console */
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
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
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
import {
  provideTranslateCompiler,
  provideTranslateService,
  TranslateService,
} from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { POCKETBASE_INSTANCE, pocketBaseFactory } from '@plastik/core/api-pocketbase';
import { providePocketBaseWithTranslationsEnv } from '@plastik/core/environments';
import { EcoStorePrefixTitleService } from '@plastik/eco-store/core/router-state';
import { getPocketBaseImageUrl } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore, provideEcoStoreTenant } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { PWA_APP_DATA_FN, PwaInstallService, PwaManifestService } from '@plastik/shared/pwa';
import { pocketBaseStorageLoader } from '@plastik/storage/data-access';
import { TranslateFormatJsCompiler } from 'ngx-translate-formatjs-compiler';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

// `LOCALE_ID` is fixed to 'ca', so Angular pipes (currency/date/number) only
// ever need the Catalan locale data. The 'es' locale is intentionally not
// registered to keep it out of the initial bundle.
registerLocaleData(localeCa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
        filter: req =>
          req.method === 'GET' && (req.url.includes('/i18n/') || req.url.includes('api/')),
      })
    ),
    provideZonelessChangeDetection(),
    provideRouter(
      appRoutes,
      withViewTransitions({
        skipInitialTransition: true,
      }),
      withComponentInputBinding(),
      withExperimentalAutoCleanupInjectors(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'top',
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
      // All injections must be done before any async code
      const translate = inject(TranslateService);
      const activity = inject(activityStore);
      const tenantStore = inject(ecoStoreTenantStore);
      inject(PwaInstallService);
      const pwaManifest = inject(PwaManifestService);
      const getAppData = inject(PWA_APP_DATA_FN);

      const defaultLang = environment.defaultLanguage || 'ca';
      const browserLang =
        typeof window !== 'undefined'
          ? localStorage.getItem('eco-lang') || navigator.language.split('-')[0]
          : defaultLang;
      const langToUse = ['ca', 'es', 'en'].includes(browserLang) ? browserLang : defaultLang;

      translate.setFallbackLang(defaultLang);

      try {
        await firstValueFrom(translate.use(langToUse));
      } catch {
        // Translation load failures are surfaced through the global ErrorHandlerService.
      }

      activity.setActivity(true);
      await tenantStore.getTenant();
      await pwaManifest.applyBranding(getAppData());
    }),
    { provide: LOCALE_ID, useValue: 'ca' },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: TitleStrategy, useClass: EcoStorePrefixTitleService },
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.environment === 'production' || environment.environment === 'staging',
      registrationStrategy: 'registerImmediately',
    }),
    {
      provide: IMAGE_LOADER,
      useValue: pocketBaseStorageLoader(environment.baseApiUrl),
    },
    {
      provide: PWA_APP_DATA_FN,
      useFactory: () => {
        const store = inject(ecoStoreTenantStore);

        return () => {
          const tenant = store.tenant();
          const logoPath = getPocketBaseImageUrl(tenant, tenant?.logo);
          const logo = logoPath ? `${environment.baseApiUrl}api/files/${logoPath}` : undefined;
          return {
            name: tenant?.name,
            shortName: tenant?.shortName,
            logo,
            defaultLogo: 'eco_logo',
          };
        };
      },
    },
  ],
};
