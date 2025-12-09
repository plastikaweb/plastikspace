import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  inject,
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
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { pocketBaseActivityInterceptor } from '@plastik/shared/activity/data-access';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { PrefixTitleService } from '@plastik/core/router-state';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
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
