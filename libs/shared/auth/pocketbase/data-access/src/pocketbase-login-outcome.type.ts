import { PocketBaseUserRoles } from '@plastik/core/entities';

/**
 * Result of a login attempt against the PocketBase `users` collection.
 *
 * - `authenticated`: the session is open and the store holds the user.
 * - `mfa-required`: the password was accepted but the collection demands a second factor.
 * - `role-rejected`: the credentials are valid but the role is not allowed in this app; no session is kept.
 * - `failed`: any other error (wrong credentials, network, server).
 */
export type PocketBaseLoginOutcome = 'authenticated' | 'mfa-required' | 'role-rejected' | 'failed';

export interface PocketBaseLoginOptions {
  /**
   * Roles allowed to open a session in the calling app. When omitted every role is accepted.
   */
  allowedRoles?: readonly PocketBaseUserRoles[];
}
