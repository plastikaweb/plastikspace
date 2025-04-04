import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { llecoopProductStore, productMainInitState } from '@plastik/llecoop/product/data-access';

export const productFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopProductStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  if (!previousUrl?.startsWith('/productes') || !store.initiallyLoaded()) {
    store.resetTableConfig(
      productMainInitState.pagination,
      productMainInitState.filter,
      productMainInitState.sorting
    );
  }

  return of(true);
};
