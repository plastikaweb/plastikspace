import { inject } from '@angular/core';
import PocketBase from 'pocketbase';
import { ENVIRONMENT, EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';

export function pocketBaseFactory(): PocketBase {
  const environment = inject(ENVIRONMENT);
  return new PocketBase((environment as EnvironmentPocketBaseWithTranslations).baseApiUrl);
}
