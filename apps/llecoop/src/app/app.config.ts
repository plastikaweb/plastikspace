import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  persistentMultipleTabManager,
  provideFirestore,
} from '@angular/fire/firestore';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  RouteReuseStrategy,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, RouterState, provideRouterStore } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { ENVIRONMENT } from '@plastik/core/environments';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  RouterStateEffects,
  routerReducers,
} from '@plastik/core/router-state';
import { selectActivityFeature } from '@plastik/shared/activity/data-access';
import { NotificationDataAccessModule } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarModule } from '@plastik/shared/notification/ui/mat-snackbar';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { viewConfig } from './cms-layout-config';
import { LlecoopRouteReuseStrategy } from './llecoop-route-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
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
    provideFunctions(() => {
      const functions = getFunctions(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectFunctionsEmulator(functions, '127.0.0.1', 5001);
      }
      return functions;
    }),
    // provideStorage(() => {
    //   const storage = getStorage();
    //   if (environment['useEmulators']) {
    //     connectStorageEmulator(storage, 'localhost', 9199);
    //   }
    //   return storage;
    // }),
    provideRouter(appRoutes, withViewTransitions(), withComponentInputBinding()),
    {
      provide: RouteReuseStrategy,
      useClass: LlecoopRouteReuseStrategy,
    },
    importProvidersFrom(
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
            connectInZone: true,
            trace: true,
            traceLimit: 75,
          })
        : [],
      NotificationDataAccessModule,
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
      provide: LOCALE_ID,
      useValue: 'ca-ES',
    },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
    { provide: VIEW_CONFIG, useFactory: viewConfig },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        politeness: 'assertive',
      },
    },
  ],
};
