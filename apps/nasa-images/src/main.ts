import { provideHttpClient } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutFeatureModule } from '@plastik/core/cms-layout';
import { ENVIRONMENT } from '@plastik/core/environments';
import { CustomRouterSerializer, routerReducers, RouterStateEffects } from '@plastik/core/router-state';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routing';
import { headerConfig, viewConfig } from './app/cms-layout-config';
import { environment } from './environments/environment';
import { NasaImagesViews } from '@plastik/nasa-images/entities';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore(),
    importProvidersFrom(AngularSvgIconModule.forRoot()),
    importProvidersFrom(
      StoreModule.forRoot(routerReducers, {
        metaReducers: [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
    ),
    importProvidersFrom(
      StoreRouterConnectingModule.forRoot({
        serializer: CustomRouterSerializer,
        navigationActionTiming: NavigationActionTiming.PostActivation,
      }),
    ),
    importProvidersFrom(EffectsModule.forRoot([RouterStateEffects])),
    importProvidersFrom(
      !environment.production
        ? StoreDevtoolsModule.instrument({
            name: environment.name,
            maxAge: 25,
          })
        : [],
    ),
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    importProvidersFrom(CoreCmsLayoutFeatureModule.withConfig<NasaImagesViews>(headerConfig, viewConfig)),
  ],
  // eslint-disable-next-line no-console
}).catch(err => console.error(err));
