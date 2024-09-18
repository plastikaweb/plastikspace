import { Provider } from '@angular/core';

import { ENVIRONMENT } from './environment.token';

/**
 * @description A environment service mock function to add to providers TestBed array.
 * @returns { Provider } The Provider ready to be added to providers array in modules or standalone components.
 */
export function provideEnvironmentMock(): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
      apiUrl: 'https://api',
    },
  };
}
