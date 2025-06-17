import { LiveAnnouncer } from '@angular/cdk/a11y';
import { provideHttpClient } from '@angular/common/http';
import {
  effect,
  ErrorHandler,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { ENVIRONMENT } from '@plastik/core/environments';
import { PrefixTitleService } from '@plastik/core/router-state';
import { activityStore } from '@plastik/shared/activity/data-access';
import { FORM_DISABLE_TOKEN } from '@plastik/shared/form/util';
import { ErrorHandlerService } from '@plastik/shared/notification/data-access';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { viewConfig } from './cms-layout-config';

export const appConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
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
    provideAppInitializer(() => {
      const liveAnnouncer = inject(LiveAnnouncer);
      const isActive = inject(activityStore).isActive;
      effect(() => {
        if (isActive()) {
          liveAnnouncer.announce('Carregant dades...', 'polite', 100);
        }
      });
    }),
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    { provide: VIEW_CONFIG, useFactory: viewConfig },
    {
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
    {
      provide: LOCALE_ID,
      useValue: 'ca',
    },
    {
      provide: FORM_DISABLE_TOKEN,
      useFactory: () => inject(activityStore).isActive,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
};
