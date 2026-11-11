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

/**
 * Result of checking the emailed one-time code of a pending login.
 *
 * - `authenticated` and `role-rejected`: as in {@link PocketBaseLoginOutcome}; the pending login is over.
 * - `invalid-code`: wrong, expired or already used code. The pending login is kept: a wrong try does not
 *   burn the code, so the user may retype it or ask for a new one.
 * - `too-many-attempts`: PocketBase allows five checks per user every three minutes and answers 429 beyond that,
 *   even to the right code. The pending login is kept.
 * - `challenge-expired`: the pending login itself ran out (`mfa.duration`). PocketBase burns the code in this
 *   case, so the pending login is dropped and the user must start again from the password.
 * - `failed`: there is no pending login, no code was requested, or the request did not get an answer.
 */
export type PocketBaseLoginCodeOutcome =
  | 'authenticated'
  | 'role-rejected'
  | 'invalid-code'
  | 'too-many-attempts'
  | 'challenge-expired'
  | 'failed';

/**
 * A login that passed the password check and is waiting for the emailed one-time code.
 */
export interface PocketBaseLoginChallenge {
  /**
   * The address the code is sent to.
   */
  email: string;
  /**
   * The id of the pending login, handed out by PocketBase with the 401.
   */
  mfaId: string;
  /**
   * The id of the last code request, or null while no code has been requested.
   */
  otpId: string | null;
}

export interface PocketBaseLoginOptions {
  /**
   * Roles allowed to open a session in the calling app. When omitted every role is accepted.
   */
  allowedRoles?: readonly PocketBaseUserRoles[];
}
