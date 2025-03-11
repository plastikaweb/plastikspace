import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { initState, llecoopUserStore } from '@plastik/llecoop/user/data-access';

export const userFeatureListResolver: ResolveFn<Observable<boolean>> = (): Observable<boolean> => {
  const store = inject(llecoopUserStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/admin/usuari') || !store.initiallyLoaded()) {
    store.resetTableConfig(initState.pagination, initState.filter, initState.sorting);
  }

  return of(true);
};
