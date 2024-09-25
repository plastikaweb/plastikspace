import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';

export const ProductDetailResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
): boolean => {
  const store = inject(LlecoopProductStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return false;
  }

  store.setSelectedItemId(id);
  return true;
};
