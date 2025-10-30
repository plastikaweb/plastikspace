/**
 * A blueprint for all apps environments.
 */
export type Environment<E extends Record<string, unknown> = never> = {
  production: boolean;
  name: string;
} & E;
