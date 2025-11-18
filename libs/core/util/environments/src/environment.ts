export type EnvironmentName = 'development' | 'staging' | 'production' | 'test';

/**
 * A blueprint for all apps environments.
 */
export interface Environment {
  readonly production: boolean;
  readonly name: string;
  readonly environment: EnvironmentName;
}

export interface EnvironmentWithApiUrl extends Environment {
  readonly baseApiUrl: string;
}
