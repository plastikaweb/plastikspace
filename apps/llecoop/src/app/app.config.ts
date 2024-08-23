import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, TitleStrategy, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore } from '@ngrx/router-store';
import { StoreModule, provideStore } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CORE_CMS_LAYOUT_HEADER_CONFIG, CoreCmsLayoutDataAccessModule, VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { getVisibleNavigationList } from '@plastik/core/entities';
import { ENVIRONMENT } from '@plastik/core/environments';
import { CoreNotificationDataAccessModule } from '@plastik/core/notification/data-access';
import { CoreNotificationUiMatSnackbarModule } from '@plastik/core/notification/ui/mat-snackbar';
import { CustomRouterSerializer, PrefixTitleService, RouterStateEffects, routerReducers } from '@plastik/core/router-state';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { firebaseConfig } from '../../firebase';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { headerConfig, viewConfig } from './cms-layout-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(appRoutes, withViewTransitions(), withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStore(),
    importProvidersFrom(
      AngularSvgIconModule.forRoot(),
      StoreModule.forRoot(routerReducers, {
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
      EffectsModule.forRoot([RouterStateEffects]),
      isDevMode() ? StoreDevtoolsModule.instrument({ name: environment.name, maxAge: 25, connectInZone: true }) : [],
      CoreCmsLayoutDataAccessModule,
      CoreNotificationDataAccessModule,
      CoreNotificationUiMatSnackbarModule,
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
      provide: TitleStrategy,
      useClass: PrefixTitleService,
    },
    { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: headerConfig },
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
