import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

import { ecoAdminHomeFor, isEcoAdminRole } from './eco-admin-roles';

/**
 * Guards the login screen: it is for visitors without a session.
 *
 * A signed-in administrator is sent to their home. A session of any other role is closed and the login
 * screen is shown, so the pair formed with `ecoAdminSessionGuard` can never loop.
 * @returns {boolean | UrlTree} True to show the login screen, else the administrator's home.
 */
export const ecoAdminAnonymousGuard: CanActivateFn = (): boolean | UrlTree => {
  const profileStore = inject(pocketBaseUserProfileStore);
  const router = inject(Router);

  profileStore.checkAuth();

  if (!profileStore.isAuthenticated()) {
    return true;
  }

  const role = profileStore.user()?.role;

  if (isEcoAdminRole(role)) {
    return router.parseUrl(ecoAdminHomeFor(role));
  }

  profileStore.logout();

  return true;
};
