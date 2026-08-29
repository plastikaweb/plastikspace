import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { filter, firstValueFrom, map, take } from 'rxjs';

export const shippingAvailableGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  const tenantLoaded$ = toObservable(tenantStore.loaded);

  return firstValueFrom(
    tenantLoaded$.pipe(
      filter(Boolean),
      take(1),
      map(() => {
        if (!tenantStore.isShippingAvailable()) {
          return router.createUrlTree(['/cistella/pendent']);
        }

        return true;
      })
    )
  );
};
