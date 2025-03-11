import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  llecoopUserOrderStore,
  userOrderMainInitState,
} from '@plastik/llecoop/order-list/data-access';

export const userOrderFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const userOrderStore = inject(llecoopUserOrderStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  userOrderStore.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/soci/comanda') || !userOrderStore.initiallyLoaded()) {
    userOrderStore.resetTableConfig(
      userOrderMainInitState.pagination,
      userOrderMainInitState.filter,
      userOrderMainInitState.sorting
    );
  }

  return of(true);
};
