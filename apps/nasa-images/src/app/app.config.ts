import { AngularSvgIconModule } from 'angular-svg-icon';

import { A11yModule } from '@angular/cdk/a11y';
import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter, TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore, RouterState } from '@ngrx/router-store';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutDataAccessModule, VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { getVisibleNavigationList } from '@plastik/core/entities';
import { ENVIRONMENT } from '@plastik/core/environments';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  routerReducers,
  RouterStateEffects,
} from '@plastik/core/router-state';
import { NASA_IMAGES_PROVIDERS } from '@plastik/nasa-images/search/data-access';
import { activityStore } from '@plastik/shared/activity/data-access';
import { notificationStore } from '@plastik/shared/notification/data-access';

import { environment } from '../environments/environment';
import { routes } from './app.routing';
import { headerConfig, viewConfig } from './cms-layout-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
    provideAppInitializer(() => {
      if (typeof window === 'undefined') {
        return;
      }

      // Rebind RAF APIs to `window` so zoneless schedulers (NgRx Component) avoid "Illegal invocation".
      const boundRaf = window.requestAnimationFrame.bind(
        window
      ) as typeof window.requestAnimationFrame;
      const boundCancelRaf = window.cancelAnimationFrame.bind(
        window
      ) as typeof window.cancelAnimationFrame;

      window.requestAnimationFrame = boundRaf;
      window.cancelAnimationFrame = boundCancelRaf;
    }),
    provideStore(),
    importProvidersFrom(
      A11yModule,
      AngularSvgIconModule.forRoot(),
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
      notificationStore,
      activityStore
    ),
    ...NASA_IMAGES_PROVIDERS,
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
    { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: headerConfig },
    { provide: VIEW_CONFIG, useValue: getVisibleNavigationList(viewConfig) },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        verticalPosition: 'top',
        politeness: 'assertive',
      },
    },
    { provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://images-assets.nasa.gov' },
  ],
};
