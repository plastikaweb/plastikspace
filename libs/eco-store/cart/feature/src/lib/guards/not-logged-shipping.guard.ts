import { map, Observable, of, switchMap, take } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

export const ecoStoreNotLoggedShippingGuard: CanActivateFn = (
  _route,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const profileStore = inject(pocketBaseUserProfileStore);
  const confirmService = inject(SharedConfirmDialogService);
  const router = inject(Router);

  return toObservable(profileStore.isAuthenticated).pipe(
    take(1),
    switchMap(isAuthenticated => {
      if (!isAuthenticated) {
        return confirmService
          .confirm(
            'cart.notLogged.title',
            `cart.notLogged.description`,
            'cart.notLogged.continueAsGuest',
            'cart.notLogged.login'
          )
          .pipe(
            take(1),
            map(confirmed => {
              if (confirmed) {
                return router.createUrlTree(['/accedir'], {
                  queryParams: { returnUrl: state.url },
                });
              }

              return router.createUrlTree(['/cistella/resum'], { relativeTo: null });
            })
          );
      }

      return of(true);
    })
  );
};
