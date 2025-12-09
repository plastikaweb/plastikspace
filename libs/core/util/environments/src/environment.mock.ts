import { Provider } from '@angular/core';

import {
  ENVIRONMENT,
  ENVIRONMENT_WITH_API,
  POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
} from './environment.token';

export function provideEnvironmentMock(): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
    },
  };
}

export function provideEnvironmentWithApiMock(): Provider {
  return {
    provide: ENVIRONMENT_WITH_API,
    useValue: {
      production: false,
      name: 'my-app',
      baseApiUrl: 'https://api',
    },
  };
}

export function provideEnvironmentPocketBaseTranslationMock(): Provider {
  return {
    provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
      baseApiUrl: 'https://api',
      languages: ['en', 'es'],
      defaultLanguage: 'en',
      client: 'test-client',
    },
  };
}
