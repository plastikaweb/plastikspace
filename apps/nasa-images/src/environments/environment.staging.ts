import { EnvironmentWithApiUrl } from '@plastik/core/environments';

export const environment: EnvironmentWithApiUrl = {
  name: 'NASA images',
  production: true,
  baseApiUrl: 'https://images-api.nasa.gov',
  environment: 'staging',
};
