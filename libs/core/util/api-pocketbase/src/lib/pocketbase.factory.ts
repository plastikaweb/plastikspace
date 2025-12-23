import { inject } from '@angular/core';
import PocketBase from 'pocketbase';
import { ENVIRONMENT, EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';

/**
 * @description Factory function to create a PocketBase instance with the configured base API URL.
 * @returns {PocketBase} A configured PocketBase client instance.
 */
export function pocketBaseFactory(): PocketBase {
  const environment = inject(ENVIRONMENT);
  return new PocketBase((environment as EnvironmentPocketBaseWithTranslations).baseApiUrl);
}
