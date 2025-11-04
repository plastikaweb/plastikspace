import { Environment } from '@plastik/core/environments';

export const environment: Environment<{ baseApiUrl: string }> = {
  production: false,
  name: 'plastikaweb',
  baseApiUrl: 'http://localhost:8881/graphql',
};
