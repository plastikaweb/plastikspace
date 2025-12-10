import { InjectionToken, Provider } from '@angular/core';

import {
  Environment,
  EnvironmentPocketBase,
  EnvironmentPocketBaseWithTranslations,
  EnvironmentWithApiUrl,
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

/**
 * @description A provider ready to use EnvironmentWithApiUrl.
 * @param { EnvironmentWithApiUrl } env The environment definition.
 * @returns { Provider[] } The providers array.
 */
export function provideWithApiEnv(env: EnvironmentWithApiUrl): Provider[] {
  return [
    {
      provide: ENVIRONMENT_WITH_API,
      useValue: env,
    },
    { provide: ENVIRONMENT, useExisting: ENVIRONMENT_WITH_API },
  ];
}

/**
 * @description A provider ready to use EnvironmentPocketBase.
 * @param { EnvironmentPocketBase } env The environment definition.
 * @returns { Provider[] } The providers array.
 */
export function providePocketBaseEnv(env: EnvironmentPocketBase): Provider[] {
  return [
    {
      provide: POCKETBASE_ENVIRONMENT,
      useValue: env,
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_ENVIRONMENT },
  ];
}

/**
 * @description A provider ready to use EnvironmentPocketBaseWithTranslations.
 * @param { EnvironmentPocketBaseWithTranslations } env The environment definition.
 * @returns { Provider[] } The providers array.
 */
export function providePocketBaseWithTranslationsEnv(
  env: EnvironmentPocketBaseWithTranslations
): Provider[] {
  return [
    {
      provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
      useValue: env,
    },
    { provide: ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: ENVIRONMENT_WITH_API, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
    { provide: POCKETBASE_ENVIRONMENT, useExisting: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT },
  ];
}
