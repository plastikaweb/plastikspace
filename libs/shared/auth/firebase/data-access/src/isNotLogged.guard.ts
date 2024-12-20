import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';

export const isNotLoggedGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>(resolve => {
    auth.onAuthStateChanged(user => {
      if (user?.uid && user?.emailVerified) {
        router.navigate(['']);
        resolve(false);
      }

      resolve(true);
    });
  });
};
