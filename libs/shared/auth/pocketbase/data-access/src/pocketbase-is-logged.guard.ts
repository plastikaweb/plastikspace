import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';

export const pocketBaseIsLoggedGuard: CanActivateFn = () => {
  const profileStore = inject(pocketBaseUserProfileStore);
  const router = inject(Router);

  if (!profileStore.isAuthenticated()) {
    return router.parseUrl('/accedir');
  }

  return true;
};
