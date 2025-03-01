import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  initProductStoreFilter,
  initProductStorePagination,
  initProductStoreSorting,
  llecoopProductStore,
} from '@plastik/llecoop/product/data-access';

export const productFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopProductStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);
  if (!previousUrl?.startsWith('/admin/producte') || !store.initiallyLoaded()) {
    store.setSorting(initProductStoreSorting);
    store.setFilter(initProductStoreFilter);
    store.setPagination(initProductStorePagination);
    store.getAll();
    store.setCount();
  }

  return of(true);
};
