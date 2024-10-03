import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { routerActions } from '@plastik/core/router-state';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopUserFireService } from './user-fire.service';

type UserState = LlecoopFeatureStore;

export const LLecoopUserStore = signalStore(
  { providedIn: 'root' },
  withDevtools('users'),
  withState<UserState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['email', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopUser>(),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  })),
  withMethods(
    (
      store,
      userService = inject(LlecoopUserFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store),
      firebaseAuthService = inject(FirebaseAuthService)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(() =>
            userService.getAll().pipe(
              tapResponse({
                next: users => {
                  patchState(
                    store,
                    setAllEntities(users, { selectId: entity => entity.id || '' }),
                    { loaded: true, lastUpdated: new Date() }
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
                error: error => {
                  if (firebaseAuthService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar els productes: ${error}`,
                      'ERROR'
                    );
                  }
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
              })
            )
          )
        )
      ),
      create: rxMethod<Pick<LlecoopUser, 'email'>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(({ email }) => {
            return userService.create(email).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/admin/usuari'] }));
                  storeNotificationService.create(
                    `Soci amb email "${email}" afegit a la llista`,
                    'SUCCESS'
                  );
                },
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `No s'ha pogut guardar el email "${email}": ${error}`,
                    'ERROR'
                  );
                },
              })
            );
          })
        )
      ),
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) getAll();
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying product store');
    },
  })
);
