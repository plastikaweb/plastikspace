import { map, Observable, of, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

export const ecoStoreTrialExpiredGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const profileStore = inject(pocketBaseUserProfileStore);
  const confirmService = inject(SharedConfirmDialogService);
  const router = inject(Router);

  return toObservable(profileStore.isTrialExpired).pipe(
    take(1),
    switchMap(isTrialExpired => {
      if (isTrialExpired) {
        return confirmService
          .confirm(
            'store.trial.expiredTitle',
            'store.trial.expiredMessage',
            'store.trial.expiredSecondary',
            'store.trial.expiredCta'
          )
          .pipe(
            take(1),
            map(confirmed => {
              if (confirmed) {
                // TODO: Redirect to PRV-06 (sol·licitud d'adhesió)
                return router.createUrlTree(['/perfil']);
              }
              return router.createUrlTree(['/botiga']);
            })
          );
      }
      return of(true);
    })
  );
};
