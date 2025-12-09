import { Provider } from '@angular/core';

import {
  ENVIRONMENT,
  ENVIRONMENT_WITH_API,
  POCKETBASE_ENVIRONMENT,
  POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
} from './environment.token';

/**
 * Environment base mock provider.
 * @returns { Provider } Environment mock provider.
 */
export function provideEnvironmentMock(): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
    },
  };
}

/**
 * Environment mock provider with API URL.
 * @returns { Provider } Environment-with-api mock provider.
 */
export function provideEnvironmentWithApiMock(): Provider[] {
  return [
    {
      provide: ENVIRONMENT_WITH_API,
      useValue: {
        production: false,
        name: 'my-app',
        baseApiUrl: 'https://api',
      },
    },
    { provide: ENVIRONMENT, useExisting: ENVIRONMENT_WITH_API },
  ];
}

/**
 * PocketBase environment mock provider without translations.
 * @returns { Provider } PocketBase environment mock provider.
 */
export function provideEnvironmentPocketBaseMock(): Provider[] {
  return [
    {
      provide: POCKETBASE_ENVIRONMENT,
      useValue: {
        production: false,
        name: 'my-app',
        baseApiUrl: 'https://api',
        client: 'test-client',
      },
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_ENVIRONMENT },
    { provide: ENVIRONMENT_WITH_API, useExisting: POCKETBASE_ENVIRONMENT },
  ];
}

/**
 * PocketBase environment mock provider with translations.
 * @returns { Provider } PocketBase environment with translations mock provider.
 */
export function provideEnvironmentPocketBaseTranslationMock(): Provider[] {
  return [
    {
      provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
      useValue: {
        production: false,
        name: 'my-app',
        baseApiUrl: 'https://api',
        languages: ['en', 'es'],
        defaultLanguage: 'en',
        client: 'test-client',
      },
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: ENVIRONMENT_WITH_API, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: POCKETBASE_ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
  ];
}
