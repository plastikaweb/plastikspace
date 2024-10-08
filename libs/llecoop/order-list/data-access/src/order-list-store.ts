/* eslint-disable no-console */
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
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { pipe, switchMap, tap } from 'rxjs';
import { LlecoopOrderListFireService } from './order-list-fire.service';

type LlecoopOrderListState = LlecoopFeatureStore;

export const LLecoopOrderListStore = signalStore(
  { providedIn: 'root' },
  withDevtools('order-list'),
  withState<LlecoopOrderListState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopOrder>(),
  withComputed(({ ids }) => ({
    count: computed(() => ids().length),
  })),
  withMethods(
    (
      store,
      orderListService = inject(LlecoopOrderListFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(() =>
            orderListService.getAll().pipe(
              tapResponse({
                next: orders => {
                  patchState(
                    store,
                    setAllEntities(orders, { selectId: entity => entity.id || '' }),
                    { loaded: true, lastUpdated: new Date() }
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
                error: error => {
                  storeNotificationService.create(
                    `No s'ha pogut carregar el llistat de comandes: ${error}`,
                    'ERROR'
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
              })
            )
          )
        )
      ),
      create: rxMethod<Partial<LlecoopOrder>>(
        pipe(
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap(order => {
            return orderListService.create(order).pipe(
              tapResponse({
                next: () => state.dispatch(activityActions.setActivity({ isActive: false })),
                error: error => {
                  storeNotificationService.create(
                    `No s'ha pogut crear la comanda: ${error}`,
                    'ERROR'
                  );
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                },
                complete: () => {
                  storeNotificationService.create(
                    `Comanda ${order.name} creada amb èxit`,
                    'SUCCESS'
                  );
                },
              })
            );
          })
        )
      ),
      setSorting: (sorting: LlecoopOrderListState['sorting']) => patchState(store, { sorting }),
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) getAll();
    },
    onDestroy() {
      console.log('Destroying order-list store');
    },
  })
);
