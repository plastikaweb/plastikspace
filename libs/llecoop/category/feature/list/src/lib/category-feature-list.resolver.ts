import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  initCategoryStoreFilter,
  initCategoryStorePagination,
  initCategoryStoreSorting,
  llecoopCategoryStore,
} from '@plastik/llecoop/category/data-access';

export const categoryFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopCategoryStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/admin/categoria') || !store.initiallyLoaded()) {
    store.setSorting(initCategoryStoreSorting);
    store.setFilter(initCategoryStoreFilter);
    store.setPagination(initCategoryStorePagination);
    store.getAll();
    store.setCount();
  }

  return of(true);
};
