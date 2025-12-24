import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import localeEs from '@angular/common/locales/es';

import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { POCKETBASE_INSTANCE, pocketBaseFactory } from '@plastik/core/api-pocketbase';
import { providePocketBaseWithTranslationsEnv } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { pocketBaseActivityInterceptor } from '@plastik/shared/activity/data-access';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { environment } from '../environments/environment';
import { appRoutes } from './routing/app.routes';
import { ALL_PRODUCTS_ICON } from '@plastik/eco-store/shared/tokens';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

registerLocaleData(localeCa);
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    { provide: LOCALE_ID, useValue: 'ca' },
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    providePocketBaseWithTranslationsEnv(environment),
    { provide: POCKETBASE_INSTANCE, useFactory: pocketBaseFactory },
    provideHttpClient(withInterceptors([])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: environment.defaultLanguage,
      lang: environment.defaultLanguage,
    }),
    provideAppInitializer(() => {
      pocketBaseActivityInterceptor();
      inject(ecoStoreProductCategoriesStore);
      inject(ALL_PRODUCTS_ICON);
    }),
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
  ],
};
