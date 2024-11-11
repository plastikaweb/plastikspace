import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RedirectCommand, ResolveFn, Router } from '@angular/router';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { filter, map, Observable } from 'rxjs';

export const ProductDetailResolver: ResolveFn<Observable<boolean>> = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const store = inject(LlecoopProductStore);
  const id = route.paramMap.get('id');

  if (!id) {
    store.setSelectedItemId(null);
    return new RedirectCommand(router.parseUrl('/admin/producte'));
  }

  store.setSelectedItemId(id);

  return toObservable(store.selectedItem).pipe(
    map(product => {
      if (!product) {
        store.getAll();
      }
      return !!product;
    }),
    filter(Boolean)
  );
};
