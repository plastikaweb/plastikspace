import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { ENVIRONMENT } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { provideFormlyConfig } from '@plastik/shared/form';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withViewTransitions(), withComponentInputBinding()),
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
  ],
};
