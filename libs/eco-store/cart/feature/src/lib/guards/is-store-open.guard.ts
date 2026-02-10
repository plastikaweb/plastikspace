import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { Observable, filter, map } from 'rxjs';

export const isStoreOpenGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  return toObservable(tenantStore.isStoreOpen).pipe(
    map(isStoreOpen => {
      if (!isStoreOpen) {
        return router.createUrlTree(['/cistella/resum']);
      }
      return true;
    }),
    filter(Boolean)
  );
};
