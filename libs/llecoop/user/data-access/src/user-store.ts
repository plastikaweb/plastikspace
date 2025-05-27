import { filter, pipe, switchMap, tap } from 'rxjs';

import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopUser } from '@plastik/llecoop/entities';
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
  role: 'all' | 'admin' | 'user';
};

export type UserStoreFirebaseCrudState = StoreFirebaseCrudState<LlecoopUser, StoreUserFilter>;

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
  baseRoute: {
    onCreate: 'usuaris',
    onUpdate: 'perfil',
    onError: 'usuaris',
  },
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
  withMethods(store => {
    return {
      setAdmin: rxMethod<Pick<LlecoopUser, 'id'>>(
        pipe(
          filter(() => !!store._activeConnection()),
          switchMap(({ id }) => {
            store._activityStore.setActivity(true);
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
              tap(() => store._activityStore.setActivity(false))
            );
          })
        )
      ),
    };
  })
);
