import { provideAngularSvgIcon } from 'angular-svg-icon';

import { PRECONNECT_CHECK_BLOCKLIST } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore, RouterState } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService } from '@ngx-translate/core';
import {
  LayoutEffects,
  selectLayoutFeature,
  VIEW_CONFIG,
} from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { getVisibleNavigationList } from '@plastik/core/entities';
import { provideWithApiEnv } from '@plastik/core/environments';
import {
  CustomRouterSerializer,
  PrefixTitleService,
  routerReducers,
  RouterStateEffects,
} from '@plastik/core/router-state';

import { environment } from '../environments/environment';
import { routes } from './app.routing';
import { headerConfig, viewConfig } from './cms-layout-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideRouter(routes),
    provideTranslateService(),
    provideStore(routerReducers, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
      },
    }),
    provideEffects([RouterStateEffects, LayoutEffects]),
    provideState(selectLayoutFeature),
    provideAngularSvgIcon(),
    isDevMode()
      ? provideStoreDevtools({
          name: environment.name,
          maxAge: 25,
          connectInZone: true,
        })
      : [],
    provideRouterStore({
      serializer: CustomRouterSerializer,
      navigationActionTiming: NavigationActionTiming.PreActivation,
      routerState: RouterState.Minimal,
    }),
    provideWithApiEnv(environment),
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
