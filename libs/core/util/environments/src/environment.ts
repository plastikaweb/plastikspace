/**
 * A blueprint for all apps environments.
 */
export interface Environment {
  production: boolean;
  name: string;
  apiUrl: string;
}
