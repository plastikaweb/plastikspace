import { EnvironmentPocketBaseWithTranslations } from '@plastik/core/environments';

export const environment: EnvironmentPocketBaseWithTranslations = {
  production: true,
  name: 'eco-admin',
  baseApiUrl: 'https://eco-botiga.pockethost.io/',
  // Intentionally empty: unlike the storefront, eco-admin has no client-side
  // tenant binding — a tenant admin's tenant travels in the auth token
  // (`@request.auth.tenant`) and a global admin has none. See REQUIREMENTS §2.4.
  client: '',
  environment: 'production',
  languages: ['ca', 'es'],
  defaultLanguage: 'ca',
};
