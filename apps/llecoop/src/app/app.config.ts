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
  PreloadAllModules,
  RouteReuseStrategy,
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, RouterState, provideRouterStore } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutDataAccessModule, VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { ENVIRONMENT } from '@plastik/core/environments';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  RouterStateEffects,
  routerReducers,
} from '@plastik/core/router-state';
import { NotificationDataAccessModule } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarModule } from '@plastik/shared/notification/ui/mat-snackbar';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { HeaderConfigService } from './cms-header-config';
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
    provideRouter(
      appRoutes,
      withViewTransitions(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    {
      provide: RouteReuseStrategy,
      useClass: LlecoopRouteReuseStrategy,
    },
    importProvidersFrom(
      StoreModule.forRoot(routerReducers, {}),
      EffectsModule.forRoot([RouterStateEffects]),
      isDevMode()
        ? StoreDevtoolsModule.instrument({
            name: environment.name,
            maxAge: 25,
            connectInZone: true,
          })
        : [],
      CoreCmsLayoutDataAccessModule,
      NotificationDataAccessModule,
      NotificationUiMatSnackbarModule
    ),
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
      routerState: RouterState.Full,
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
    { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useFactory: HeaderConfigService },
    { provide: VIEW_CONFIG, useFactory: viewConfig },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        politeness: 'assertive',
      },
    },
  ],
};
