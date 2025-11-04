import { Environment } from '@plastik/core/environments';

export const environment: Environment<{ baseApiUrl: string }> = {
  name: 'NASA images',
  production: true,
  baseApiUrl: 'https://images-api.nasa.gov',
};
