import { pipe, switchMap, tap } from 'rxjs';

import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  StoreNotificationService,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopUserFireService } from './user-fire.service';

export type StoreUserFilter = StoreFirebaseCrudFilter & {
  name: string;
  email: string;
  role: 'all' | string;
};

export const initState: StoreFirebaseCrudState<LlecoopUser, StoreUserFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    name: '',
    email: '',
    role: 'all',
  },
  pagination: {
    pageSize: 5,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopUser>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: 'admin/usuari',
};

export const llecoopUserStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<
    LlecoopUser,
    LlecoopUserFireService,
    StoreUserFilter,
    StoreFirebaseCrudState<LlecoopUser, StoreUserFilter>
  >({
    featureName: 'user',
    dataServiceType: LlecoopUserFireService,
    initState,
  }),
  withMethods(() => {
    const userService = inject(LlecoopUserFireService);
    const storeNotificationService = inject(StoreNotificationService);
    const state = inject(Store);

    return {
      setAdmin: rxMethod<Pick<LlecoopUser, 'id'>>(
        pipe(
          switchMap(({ id }) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            if (!id) {
              throw new Error('User ID is undefined');
            }
            return userService.addAdminClaim(id).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Usuari amb id "${id}" afegit com a administrador`,
                    'SUCCESS'
                  ),
                error: () =>
                  storeNotificationService.create(
                    `No s'ha pogut afegir l'usuari com a administrador`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
    };
  })
);
