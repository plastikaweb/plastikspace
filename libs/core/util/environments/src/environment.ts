/**
 * A blueprint for all apps environments.
 */
export type Environment<E extends Record<string, unknown> = Record<string, unknown>> = {
  production: boolean;
  name: string;
  apiUrl?: string;
} & E;
