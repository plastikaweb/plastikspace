import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { filter, firstValueFrom, map, take } from 'rxjs';

export const ecoStoreProductResolver: ResolveFn<boolean | RedirectCommand> = async (
  route: ActivatedRouteSnapshot
) => {
  const productStore = inject(ecoStoreProductsStore);
  const tenantStore = inject(ecoStoreTenantStore);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');

  if (!slug) {
    return new RedirectCommand(router.parseUrl('/'));
  }

  if (productStore.setSelectedFromSlug(slug)) {
    return true;
  }

  const tenantLoaded$ = toObservable(tenantStore.loaded);

  return firstValueFrom(
    tenantLoaded$.pipe(
      filter(Boolean),
      take(1),
      map(async () => {
        try {
          await productStore.loadProductBySlug(slug);

          return true;
        } catch {
          return new RedirectCommand(router.parseUrl('/'));
        }
      })
    )
  );
};
