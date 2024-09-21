import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, initializeAuth, provideAuth } from '@angular/fire/auth';
import { connectFirestoreEmulator, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  TitleStrategy,
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore } from '@ngrx/router-store';
import { StoreModule, provideStore } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutDataAccessModule, VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { getVisibleNavigationList } from '@plastik/core/entities';
import { ENVIRONMENT } from '@plastik/core/environments';
import { CoreNotificationDataAccessModule } from '@plastik/core/notification/data-access';
import { CoreNotificationUiMatSnackbarModule } from '@plastik/core/notification/ui/mat-snackbar';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  RouterStateEffects,
  routerReducers,
} from '@plastik/core/router-state';
import { firebaseConfig } from '../../firebase';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { headerConfig, viewConfig } from './cms-layout-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig, 'llecoop')),
    provideAuth(() => {
      const auth = initializeAuth(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore(getApp('llecoop'));
      if (environment['useEmulators']) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    // provideStorage(() => {
    //   const storage = getStorage();
    //   if (environment['useEmulators']) {
    //     connectStorageEmulator(storage, 'localhost', 9199);
    //   }
    //   return storage;
    // }),
    // provideFunctions(() => {
    //   const functions = getFunctions();
    //   if (environment['useEmulators']) {
    //       connectFunctionsEmulator(functions, 'localhost', 5001);
    //   }
    //   return functions;
    // }),
    // provideFirestore(() => getFirestore(getApp())),
    provideRouter(appRoutes, withViewTransitions(), withComponentInputBinding()),
    provideStore(),
    importProvidersFrom(
      StoreModule.forRoot(routerReducers, {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
      EffectsModule.forRoot([RouterStateEffects]),
      isDevMode()
        ? StoreDevtoolsModule.instrument({
            name: environment.name,
            maxAge: 25,
            connectInZone: true,
          })
        : [],
      CoreCmsLayoutDataAccessModule,
      CoreNotificationDataAccessModule,
      CoreNotificationUiMatSnackbarModule
    ),
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
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
    { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useFactory: headerConfig },
    { provide: VIEW_CONFIG, useValue: getVisibleNavigationList(viewConfig) },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        politeness: 'assertive',
      },
    },
  ],
};
