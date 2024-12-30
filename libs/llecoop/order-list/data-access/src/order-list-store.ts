import { pipe, switchMap, tap } from 'rxjs';

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
import {
  EntityId,
  SelectEntityId,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopOrder } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';

import { LlecoopOrderListFireService } from './order-list-fire.service';

type LlecoopOrderListState = LlecoopFeatureStore & {
  selectedItemUserOrderId: EntityId | null;
};

const selectId: SelectEntityId<LlecoopOrder> = orderList => orderList?.id || '';

export const LLecoopOrderListStore = signalStore(
  { providedIn: 'root' },
  withDevtools('order-list'),
  withState<LlecoopOrderListState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'desc'],
    selectedItemId: null,
    selectedItemUserOrderId: null,
  }),
  withEntities<LlecoopOrder>(),
  withComputed(({ ids, selectedItemId, selectedItemUserOrderId, entities, entityMap }) => ({
    count: computed(() => ids().length),
    currentOrder: computed(() => entities().find(order => order.status === 'progress')),
    currentOrderProducts: computed(
      () => entities().find(order => order.status === 'progress')?.availableProducts || []
    ),
    currentOrderCount: computed(
      () => entities().find(order => order.status === 'progress')?.availableProducts.length || 0
    ),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    selectedItemUserOrder: computed(() => {
      const id = selectedItemId();
      const selectedOrderList = id !== null ? entityMap()[id] : null;
      return selectedOrderList && selectedOrderList.orders
        ? selectedOrderList.orders.find(order => order.id === selectedItemUserOrderId())
        : null;
    }),
  })),
  withMethods(
    (
      store,
      orderListService = inject(LlecoopOrderListFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store),
      firebaseAuthService = inject(FirebaseAuthService)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService.getAll().pipe(
              tapResponse({
                next: orders =>
                  patchState(store, setAllEntities(orders, { selectId }), {
                    loaded: true,
                    lastUpdated: new Date(),
                  }),
                error: error => {
                  if (firebaseAuthService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar el llistat de comandes: ${error}`,
                      'ERROR'
                    );
                  }
                },
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      create: rxMethod<Partial<LlecoopOrder>>(
        pipe(
          switchMap(order => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService.create(order).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Comanda ${order.name} creada amb èxit`,
                    'SUCCESS'
                  ),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear la comanda: ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      changeStatus: rxMethod<LlecoopOrder>(
        pipe(
          switchMap(order => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService
              .update({ ...order, status: order.status === 'progress' ? 'waiting' : 'progress' })
              .pipe(
                tapResponse({
                  next: response => {
                    console.log(response);
                    storeNotificationService.create(
                      `Estat de la comanda "${order['name']}" actualitzat correctament`,
                      'SUCCESS'
                    );
                  },
                  error: error =>
                    storeNotificationService.create(
                      `No s'ha pogut actualitzar l'estat de la comanda "${order['name']}": ${error}`,
                      'ERROR'
                    ),
                }),
                tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
              );
          })
        )
      ),
      cancel: rxMethod<LlecoopOrder>(
        pipe(
          switchMap(order => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService.update({ ...order, status: 'cancel' }).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Comanda "${order['name']}" cancel·lada correctament`,
                    'SUCCESS'
                  ),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut cancel·lar la comanda "${order['name']}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      delete: rxMethod<LlecoopOrder>(
        pipe(
          switchMap(product => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService.delete(product).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(`Comanda "${product.name}" eliminada`, 'SUCCESS'),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar la comanda "${product.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      getAllOrderListOrders: rxMethod<Partial<EntityId>>(
        pipe(
          switchMap((id: EntityId) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return orderListService.getAllByOrderListId(id).pipe(
              tapResponse({
                next: orders =>
                  patchState(store, updateEntity({ id, changes: { orders } }, { selectId })),
                error: error => {
                  if (firebaseAuthService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar el llistat de comandes: ${error}`,
                      'ERROR'
                    );
                  }
                },
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      setSorting: (sorting: LlecoopOrderListState['sorting']) => patchState(store, { sorting }),
      setSelectedItemId: (id: EntityId | null) =>
        patchState(store, {
          selectedItemId: id,
        }),
      getItemById: (id: EntityId) => store.entityMap()[id],
      setSelectedItemUserOrderId: (id: EntityId | null) =>
        patchState(store, { selectedItemUserOrderId: id }),
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) {
        getAll();
      }
    },
    onDestroy() {
      console.log('Destroying order-list store');
    },
  })
);
