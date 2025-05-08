import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import {
  NotificationConfigService,
  notificationStore,
} from '@plastik/shared/notification/data-access';

import { FirebaseAuthService } from './firebase-auth.service';

export const isLoggedGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const store = inject(notificationStore);
  const notificationService = inject(NotificationConfigService);
  const firebaseAuthService = inject(FirebaseAuthService);

  return new Promise<boolean>(resolve => {
    auth.onAuthStateChanged(user => {
      if (user?.uid && user?.emailVerified) {
        resolve(true);
      } else if (
        user?.uid &&
        !user?.emailVerified &&
        !firebaseAuthService.firstLoginAfterRegister()
      ) {
        store.show(
          notificationService.getInstance({
            type: 'ERROR',
            message:
              'Estàs registrat al sistema però el teu compte no està validat. Revisa el teu correu per verificar-lo',
            action: 'tancar',
          })
        );

        auth.signOut();
        resolve(false);
      } else {
        router.navigate(['login']);
        resolve(false);
      }
    });
  });
};
