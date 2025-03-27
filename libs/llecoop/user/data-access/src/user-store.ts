import { filter, pipe, switchMap, tap } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopUserFireService } from './user-fire.service';

export type StoreUserFilter = StoreFirebaseCrudFilter & {
  name: string;
  email: string;
  role: 'all' | string;
};

export type UserStoreFirebaseCrudState = StoreFirebaseCrudState<LlecoopUser, StoreUserFilter> & {
  loggedUser: LlecoopUser | null;
};

type SpecificUserStoreFirebaseCrudState = Omit<
  UserStoreFirebaseCrudState,
  keyof StoreFirebaseCrudState<LlecoopUser, StoreUserFilter>
>;

export const userMainInitState: StoreFirebaseCrudState<LlecoopUser, StoreUserFilter> = {
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
  baseRoute: {
    onCreate: 'admin/usuaris',
    onUpdate: 'perfil',
    onError: 'admin/usuaris',
  },
};

const specificInitState: SpecificUserStoreFirebaseCrudState = {
  loggedUser: null,
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
    initState: { ...userMainInitState, ...specificInitState },
  }),
  withState<SpecificUserStoreFirebaseCrudState>(specificInitState),
  withComputed(({ loggedUser }) => ({
    getUserName: computed(() => loggedUser()?.name || loggedUser()?.email || 'user'),
  })),
  withMethods(store => {
    return {
      setAdmin: rxMethod<Pick<LlecoopUser, 'id'>>(
        pipe(
          filter(() => !!store._activeConnection()),
          switchMap(({ id }) => {
            store._state.dispatch(activityActions.setActivity({ isActive: true }));

            if (!id) {
              throw new Error('User ID is undefined');
            }
            return store._dataService.addAdminClaim(id).pipe(
              tapResponse({
                next: () =>
                  store._storeNotificationService.create(
                    `Usuari amb id "${id}" afegit com a administrador`,
                    'SUCCESS'
                  ),
                error: () =>
                  store._storeNotificationService.create(
                    `No s'ha pogut afegir l'usuari com a administrador`,
                    'ERROR'
                  ),
              }),
              tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      getLoggedUser: rxMethod<void>(
        pipe(
          filter(() => !!store._activeConnection()),
          switchMap(() => {
            return store._dataService.getLoggedUser().pipe(
              tapResponse({
                next: loggedUser => updateState(store, `[user] get logged user`, { loggedUser }),
                error: error =>
                  store._storeNotificationService.create(
                    `No s'ha pogut carregar l'usuari: ${error}`,
                    'ERROR'
                  ),
              })
            );
          })
        )
      ),
    };
  })
);
