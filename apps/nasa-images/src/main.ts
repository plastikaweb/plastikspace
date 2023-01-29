import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CoreCmsLayoutFeatureModule } from '@plastik/core/cms-layout';
import { CustomRouterSerializer, routerReducers, RouterStateEffects } from '@plastik/core/router-state';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app/app.component';
import { headerConfig, NasaImagesViews, viewConfig } from './app/cms-layout-config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(RouterModule.forRoot([])),
    importProvidersFrom(AngularSvgIconModule.forRoot()),
    importProvidersFrom(HttpClientModule),
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
    importProvidersFrom(CoreCmsLayoutFeatureModule.withConfig<NasaImagesViews>(headerConfig, viewConfig)),
  ],
  // eslint-disable-next-line no-console
}).catch(err => console.error(err));
