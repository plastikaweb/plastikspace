import { EnvironmentWithApiUrl } from '@plastik/core/environments';

export const environment: EnvironmentWithApiUrl = {
  production: false,
  name: 'plastikaweb',
  baseApiUrl: 'http://localhost:8881/graphql',
  environment: 'development',
};
