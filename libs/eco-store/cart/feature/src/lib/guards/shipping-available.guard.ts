import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { Observable, filter, map } from 'rxjs';

export const shippingAvailableGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  return toObservable(tenantStore.isShippingAvailable).pipe(
    map(isShippingAvailable => {
      if (!isShippingAvailable) {
        return router.createUrlTree(['/cistella/pendent']);
      }
      return true;
    }),
    filter(Boolean)
  );
};
