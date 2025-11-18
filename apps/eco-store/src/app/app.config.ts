import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
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
import { ENVIRONMENT } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideAppInitializer(() => {
      inject(ecoStoreProductCategoriesStore);
      inject(ecoStoreProductsStore);
    }),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'ca',
      lang: 'ca',
    }),
    { provide: ENVIRONMENT, useValue: environment },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' },
    },
    importProvidersFrom(EcoStoreFormlyModule),
  ],
};
