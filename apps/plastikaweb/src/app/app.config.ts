import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { InMemoryCache } from '@apollo/client/core';
import { ENVIRONMENT } from '@plastik/core/environments';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: ENVIRONMENT,
      useValue: environment,
    },
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri: environment.apiUrl }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watch: {
            pollInterval: 5000,
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
          watchQuery: {
            fetchPolicy: 'cache-and-network',
          },
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
        },
      };
    }),
  ],
};
