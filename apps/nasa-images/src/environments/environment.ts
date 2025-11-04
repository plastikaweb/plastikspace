// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { Environment } from '@plastik/core/environments';

export const environment: Environment<{ baseApiUrl: string }> = {
  name: 'Nasa Images',
  production: false,
  baseApiUrl: 'https://images-api.nasa.gov',
};
