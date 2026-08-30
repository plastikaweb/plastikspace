import { EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';

export const environment: EnvironmentPocketBaseWithTranslations = {
  production: false,
  name: 'eco-admin',
  baseApiUrl: 'http://127.0.0.1:8090/',
  // See the note in `environment.ts`: eco-admin resolves the tenant from the
  // auth token, never from configuration.
  client: '',
  environment: 'development',
  languages: ['ca', 'es'],
  defaultLanguage: 'ca',
};
