import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CustomRouterSerializer, routerReducers, RouterStateEffects } from '@plastikspace/router-state';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app/app.component';
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
  ],
}).catch(err => console.error(err));
