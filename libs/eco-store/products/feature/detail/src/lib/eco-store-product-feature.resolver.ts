import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

export const ecoStoreProductResolver: ResolveFn<boolean | RedirectCommand> = async (
  route: ActivatedRouteSnapshot
) => {
  const productStore = inject(ecoStoreProductsStore);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');

  if (!slug) {
    return new RedirectCommand(router.parseUrl('/'));
  }

  const foundInStore = productStore.setSelectedFromSlug(slug);

  if (foundInStore) {
    return true;
  }

  try {
    await productStore.loadProductBySlug(slug);
    return true;
  } catch {
    return new RedirectCommand(router.parseUrl('/'));
  }
};
