import { InjectionToken } from '@angular/core';
import { Provider } from '@angular/core';

import {
  Environment,
  EnvironmentPocketBase,
  EnvironmentWithApiUrl,
  EnvironmentPocketBaseWithTranslations,
} from './environment';

export const ENVIRONMENT: InjectionToken<Environment> = new InjectionToken('ENVIRONMENT');
export const ENVIRONMENT_WITH_API: InjectionToken<EnvironmentWithApiUrl> = new InjectionToken(
  'ENVIRONMENT_WITH_API'
);
export const POCKETBASE_ENVIRONMENT: InjectionToken<EnvironmentPocketBase> = new InjectionToken(
  'POCKETBASE_ENVIRONMENT'
);
export const POCKETBASE_WITH_TRANSLATION_ENVIRONMENT: InjectionToken<EnvironmentPocketBaseWithTranslations> =
  new InjectionToken('POCKETBASE_WITH_TRANSLATION_ENVIRONMENT');

export function provideWithApiEnv(envValue: EnvironmentWithApiUrl): Provider[] {
  return [
    {
      provide: ENVIRONMENT_WITH_API,
      useValue: envValue,
    },
    { provide: ENVIRONMENT, useExisting: ENVIRONMENT_WITH_API },
  ];
}

export function providePocketBaseEnv(envValue: EnvironmentPocketBase): Provider[] {
  return [
    {
      provide: POCKETBASE_ENVIRONMENT,
      useValue: envValue,
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_ENVIRONMENT },
  ];
}

export function providePocketBaseWithTranslationsEnv(
  envValue: EnvironmentPocketBaseWithTranslations
): Provider[] {
  return [
    {
      provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
      useValue: envValue,
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: ENVIRONMENT_WITH_API, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: POCKETBASE_ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
  ];
}
