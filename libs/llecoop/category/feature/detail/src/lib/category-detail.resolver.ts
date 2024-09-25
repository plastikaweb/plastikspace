import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const CategoryDetailResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
): boolean => {
  const store = inject(LlecoopCategoryStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return false;
  }

  store.setSelectedItemId(id);
  return true;
};
