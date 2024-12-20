import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { filter, map, Observable } from 'rxjs';

export const CategoryDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(LlecoopCategoryStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/admin/categoria'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(category => {
      if (!category) {
        store.getAll();
      }
      return !!category;
    }),
    filter(Boolean)
  );
};
