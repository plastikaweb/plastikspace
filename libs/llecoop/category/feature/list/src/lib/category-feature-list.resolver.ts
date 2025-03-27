import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { initState, llecoopCategoryStore } from '@plastik/llecoop/category/data-access';

export const categoryFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopCategoryStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/admin/categories') || !store.initiallyLoaded()) {
    store.resetTableConfig(initState.pagination, initState.filter, initState.sorting);
  }

  return of(true);
};
