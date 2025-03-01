import { pipe, switchMap, tap } from 'rxjs';

/* eslint-disable no-console */
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import {
  StoreFirebaseCrudFilter,
  StoreNotificationService,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopUserFireService } from './user-fire.service';

export type StoreUserFilter = StoreFirebaseCrudFilter & {
  text: string;
  role: 'all' | string;
};

export const initUserStoreFilter: StoreUserFilter = {
  text: '',
  role: 'all',
};

export const initUserStorePagination = {
  pageSize: 5,
  pageIndex: 0,
  pageLastElements: new Map<number, LlecoopUser>(),
};

export const initUserStoreSorting = ['updatedAt', 'desc'] as TableSortingConfig;

export const llecoopUserStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<LlecoopUser, LlecoopUserFireService, StoreUserFilter>({
    featureName: 'user',
    dataServiceType: LlecoopUserFireService,
    initFilter: initUserStoreFilter,
    initSorting: initUserStoreSorting,
    initPagination: initUserStorePagination,
    baseRoute: 'admin/usuari',
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
