import { EnvironmentWithApiUrl } from '@plastik/core/environments';

export interface EcoStoreEnvironment extends EnvironmentWithApiUrl {
  client: string;
  languages: string[];
  defaultLanguage: string;
}
