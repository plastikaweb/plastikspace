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
import { ENVIRONMENT } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { ecoStoreProductCategoriesStore } from '@plastik/eco-store/product-categories/data-access';
import { provideFormlyConfig } from '@plastik/shared/form';
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
    provideFormlyConfig(),
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
    provideAppInitializer(() => {
      inject(ecoStoreProductCategoriesStore);
    }),
  ],
};
