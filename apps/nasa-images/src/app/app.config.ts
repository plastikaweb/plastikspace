import { A11yModule } from '@angular/cdk/a11y';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter } from '@angular/router';
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
import { environment } from '../environments/environment';
import { routes } from './app.routing';
import { headerConfig, viewConfig } from './cms-layout-config';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
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
      isDevMode() ? StoreDevtoolsModule.instrument({ name: environment.name, maxAge: 25 }) : [],
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
