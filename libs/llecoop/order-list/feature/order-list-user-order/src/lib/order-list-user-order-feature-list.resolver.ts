import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import {
  llecoopUserOrderStore,
  userOrderMainInitState,
} from '@plastik/llecoop/order-list/data-access';

export const orderListUserOrderFeatureListResolver: ResolveFn<
  Observable<boolean>
> = (): Observable<boolean> => {
  const store = inject(llecoopUserOrderStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  store.setSelectedItemId(null);

  if (!previousUrl?.startsWith('/comandes') || !store.initiallyLoaded()) {
    store.resetTableConfig(
      userOrderMainInitState.pagination,
      userOrderMainInitState.filter,
      userOrderMainInitState.sorting
    );
  }

  return of(true);
};
