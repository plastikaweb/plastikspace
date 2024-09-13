import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';

export const isNotLoggedGuard: CanActivateFn = async () => {
  const authService = inject(FirebaseAuthService);
  const router = inject(Router);

  const user = await authService.getUser();

  if (user) {
    router.navigate(['']);
    return false;
  }
  return true;
};
