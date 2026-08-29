import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { firstValueFrom, filter, take, map } from 'rxjs';

export const shippingUnavailableGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  const tenantLoaded$ = toObservable(tenantStore.loaded);

  return firstValueFrom(
    tenantLoaded$.pipe(
      filter(Boolean),
      take(1),
      map(() => {
        if (tenantStore.isShippingAvailable()) {
          return router.createUrlTree(['/cistella/resum']);
        }

        return true;
      })
    )
  );
};
