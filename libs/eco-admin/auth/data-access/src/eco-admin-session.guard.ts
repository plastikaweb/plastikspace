import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

import { ECO_ADMIN_LOGIN_URL, isEcoAdminRole } from './eco-admin-roles';
import { resolveReturnUrl } from './resolve-return-url';

/**
 * Lets only a signed-in administrator into the application.
 *
 * A visitor without a session goes to the login screen, which keeps the address they asked for as
 * `returnUrl`. A session whose role is not an administrator's is closed before the redirect: the login
 * screen sends a signed-in user away, so leaving that session open would bounce the browser between the
 * two routes for ever. Such a session cannot come from the login screen, which already refuses the role;
 * it takes a token stored by hand or by a test.
 * @param {ActivatedRouteSnapshot} _route The route being activated. Not read.
 * @param {RouterStateSnapshot} state The router state the navigation is heading to.
 * @returns {boolean | UrlTree} True for an administrator, else the login screen.
 */
export const ecoAdminSessionGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const profileStore = inject(pocketBaseUserProfileStore);
  const router = inject(Router);

  // The token may have changed since the store last looked at it (another tab, an expired session).
  profileStore.checkAuth();

  if (!profileStore.isAuthenticated()) {
    const returnUrl = resolveReturnUrl(state.url, '/');

    return router.createUrlTree([ECO_ADMIN_LOGIN_URL], {
      queryParams: returnUrl === '/' ? {} : { returnUrl },
    });
  }

  if (!isEcoAdminRole(profileStore.user()?.role)) {
    profileStore.logout();

    return router.parseUrl(ECO_ADMIN_LOGIN_URL);
  }

  return true;
};
