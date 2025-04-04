import { Observable, of } from 'rxjs';

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { llecoopUserStore, userMainInitState } from '@plastik/llecoop/user/data-access';

export const userFeatureListResolver: ResolveFn<Observable<boolean>> = (): Observable<boolean> => {
  const store = inject(llecoopUserStore);
  const router = inject(Router);
  const previousUrl = router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

  if (!previousUrl?.startsWith('/usuaris') || !store.initiallyLoaded()) {
    store.resetTableConfig(
      userMainInitState.pagination,
      userMainInitState.filter,
      userMainInitState.sorting
    );
  }

  return of(true);
};
