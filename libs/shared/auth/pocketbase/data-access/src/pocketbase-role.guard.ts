import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PocketBaseUserRoles } from '@plastik/core/entities';

import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

export interface PocketBaseRoleGuardOptions {
  /**
   * Where to send a visitor with no session. Defaults to `/accedir`.
   */
  loginUrl?: string;
  /**
   * Where to send a signed-in user whose role is not allowed. Defaults to `/`.
   */
  redirectTo?: string;
}

/**
 * Builds a guard that only lets through signed-in users holding one of the given roles.
 * It never closes the session: what to do with a signed-in user of the wrong role is up to the app.
 * @param {readonly PocketBaseUserRoles[]} roles The roles allowed to activate the route.
 * @param {PocketBaseRoleGuardOptions} [options] Redirect targets for the two rejection cases.
 * @returns {CanActivateFn} The guard to put in the route's `canActivate`.
 */
export function pocketBaseRoleGuard(
  roles: readonly PocketBaseUserRoles[],
  options: PocketBaseRoleGuardOptions = {}
): CanActivateFn {
  return () => {
    const profileStore = inject(pocketBaseUserProfileStore);
    const router = inject(Router);

    if (!profileStore.isAuthenticated()) {
      return router.parseUrl(options.loginUrl ?? '/accedir');
    }

    const role = profileStore.user()?.role;

    if (!role || !roles.includes(role)) {
      return router.parseUrl(options.redirectTo ?? '/');
    }

    return true;
  };
}
