import { A11yModule } from '@angular/cdk/a11y';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, provideRouterStore } from '@ngrx/router-store';
import { StoreModule, provideStore } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutFeatureModule } from '@plastik/core/cms-layout';
import { ENVIRONMENT } from '@plastik/core/environments';
import { CustomRouterSerializer, PrefixTitleService, RouterStateEffects, routerReducers } from '@plastik/core/router-state';
import { NasaImagesViews } from '@plastik/nasa-images/search/entities';
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
      CoreCmsLayoutFeatureModule.withConfig<NasaImagesViews>(headerConfig, viewConfig),
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
  ],
  // eslint-disable-next-line no-console
};
