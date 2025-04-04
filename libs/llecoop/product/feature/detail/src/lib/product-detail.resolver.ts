import { filter, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { llecoopProductStore } from '@plastik/llecoop/product/data-access';

export const productDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(llecoopProductStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/productes'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(product => {
      if (!product) {
        store.getItem(id);
      }
      return !!product;
    }),
    filter(Boolean)
  );
};
