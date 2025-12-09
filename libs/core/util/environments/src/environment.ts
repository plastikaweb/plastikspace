export type EnvironmentName = 'development' | 'staging' | 'production' | 'test';

/**
 * A blueprint for all apps environments.
 */
export interface Environment {
  readonly production: boolean;
  readonly name: string;
  readonly environment: EnvironmentName;
}

export type EnvironmentWithApiUrl = Environment & {
  readonly baseApiUrl: string;
};

export type EnvironmentWithTranslations = Environment & {
  languages: string[];
  defaultLanguage: string;
};

export type EnvironmentPocketBase = EnvironmentWithApiUrl & {
  client: string;
  collectionNames?: Record<string, string>;
};

export type EnvironmentPocketBaseWithTranslations = EnvironmentPocketBase &
  EnvironmentWithTranslations;
