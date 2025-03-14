import { filter, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn } from '@angular/router';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';

export const profileFeatureResolver: ResolveFn<Observable<boolean>> = () => {
  const store = inject(llecoopUserStore);

  return toObservable(store.loggedUser).pipe(
    map(user => {
      if (!user) {
        store.getLoggedUser();
      }
      return !!user;
    }),
    filter(Boolean)
  );
};
