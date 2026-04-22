import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

export const ecoStoreNotLoggedOrdersGuard: CanActivateFn = (): boolean | UrlTree => {
  const platformId = inject(PLATFORM_ID);
  const profileStore = inject(pocketBaseUserProfileStore);
  const router = inject(Router);

  if (isPlatformServer(platformId)) {
    return true;
  }

  if (!profileStore.isAuthenticated()) {
    return router.createUrlTree(['/accedir']);
  }

  return true;
};
