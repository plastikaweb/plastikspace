import { filter, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { llecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const categoryDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(llecoopCategoryStore);
  const id = route.paramMap.get('id');

  if (!id) {
    return new RedirectCommand(router.parseUrl('/categories'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(category => {
      if (!category) {
        store.getItem(id);
      }
      return !!category;
    }),
    filter(Boolean)
  );
};
