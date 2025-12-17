import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn } from '@angular/router';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { Router } from '@angular/router';

export const ecoStoreProductResolver: ResolveFn<boolean | RedirectCommand> = async (
  route: ActivatedRouteSnapshot
) => {
  const productStore = inject(ecoStoreProductsStore);
  const router = inject(Router);

  const slug = route.paramMap.get('slug');

  if (!slug) {
    return new RedirectCommand(router.parseUrl('/'));
  }

  productStore.enableListLoading(false);

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
