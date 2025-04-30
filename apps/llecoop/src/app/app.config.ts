import { A11yModule } from '@angular/cdk/a11y';
import { DATE_PIPE_DEFAULT_OPTIONS, IMAGE_LOADER } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  DEFAULT_CURRENCY_CODE,
  ErrorHandler,
  importProvidersFrom,
  inject,
  isDevMode,
  LOCALE_ID,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { connectStorageEmulator, getStorage, provideStorage } from '@angular/fire/storage';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouteReuseStrategy,
  TitleStrategy,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore, RouterState } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { ENVIRONMENT } from '@plastik/core/environments';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  routerReducers,
  RouterStateEffects,
} from '@plastik/core/router-state';
import { LlecoopEnvironment } from '@plastik/llecoop/entities';
import { selectActivityFeature, selectIsActive } from '@plastik/shared/activity/data-access';
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/util';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarModule } from '@plastik/shared/notification/ui/mat-snackbar';
import { imageKitLoader } from '@plastik/storage/data-access';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { viewConfig } from './cms-layout-config';
import { LlecoopRouteReuseStrategy } from './llecoop-route-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase, 'llecoop')),
    provideAuth(() => {
      const auth = getAuth(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      }
      persistentMultipleTabManager();

      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
      }
      return functions;
    }),
    provideRouter(appRoutes, withViewTransitions(), withComponentInputBinding()),
    {
      provide: RouteReuseStrategy,
      useClass: LlecoopRouteReuseStrategy,
    },
    importProvidersFrom(
      A11yModule,
      StoreModule.forRoot(routerReducers, {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
      EffectsModule.forRoot([RouterStateEffects]),
      StoreModule.forFeature(selectActivityFeature),
      isDevMode()
        ? StoreDevtoolsModule.instrument({
            name: environment.name,
            maxAge: 25,
            connectInZone: false,
            trace: true,
            traceLimit: 75,
          })
        : [],
      NotificationUiMatSnackbarModule
    ),
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
      routerState: RouterState.Minimal,
    }),
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
    { provide: VIEW_CONFIG, useFactory: viewConfig },
    {
      provide: IMAGE_LOADER,
      useFactory: () => imageKitLoader(inject(ENVIRONMENT) as LlecoopEnvironment),
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        politeness: 'assertive',
      },
    },
    {
      provide: LOCALE_ID,
      useValue: 'ca-ES',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'EUR',
    },
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useValue: {
        dateFormat: 'dd/MM/yyyy',
      },
    },
    {
      provide: FORM_DISABLE_TOKEN,
      useFactory: () => toSignal(inject(Store).select(selectIsActive)),
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
};
