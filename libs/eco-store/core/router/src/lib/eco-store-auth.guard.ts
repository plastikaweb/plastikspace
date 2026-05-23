import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

// Guards eco-store routes that require an authenticated user. Unauthenticated
// visitors are redirected to `/accedir` with the attempted URL preserved in a
// `returnUrl` query param so the login facade can navigate back after success.
// Bypassed on the server to avoid losing SSR'd content; the client-side check
// runs once the store rehydrates.
export const ecoStoreAuthGuard: CanActivateFn = (
  _route,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const platformId = inject(PLATFORM_ID);
  const profileStore = inject(pocketBaseUserProfileStore);
  const router = inject(Router);

  if (isPlatformServer(platformId)) {
    return true;
  }

  if (!profileStore.isAuthenticated()) {
    return router.createUrlTree(['/accedir'], {
      queryParams: { returnUrl: state.url },
    });
  }

  return true;
};
