import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { initState, llecoopProductStore } from '@plastik/llecoop/product/data-access';

export const productFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopProductStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);
  if (!previousUrl?.startsWith('/admin/producte') || !store.initiallyLoaded()) {
    store.resetTableConfig(initState.pagination, initState.filter, initState.sorting);
  }

  return of(true);
};
