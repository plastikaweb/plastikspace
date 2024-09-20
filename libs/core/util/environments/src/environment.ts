/**
 * A blueprint for all apps environments.
 */
export type Environment = {
  production: boolean;
  name: string;
  apiUrl: string;
} & Record<string, unknown>;
