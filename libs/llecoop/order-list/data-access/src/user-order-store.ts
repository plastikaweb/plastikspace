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
import { routerActions, selectRouteUrl } from '@plastik/core/router-state';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';
import { filter, pipe, switchMap, withLatestFrom } from 'rxjs';
import { LLecoopOrderListStore } from './order-list-store';

import { LlecoopUserOrderFireService } from './user-order-fire.service';
type OrderState = LlecoopFeatureStore;

export const LlecoopUserOrderStore = signalStore(
  { providedIn: 'root' },
  withDevtools('orders'),
  withState<OrderState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopUserOrder>(),
  withComputed(({ ids, selectedItemId, entityMap, entities }) => ({
    count: computed(() => ids().length),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    openedOrder: computed(() => entities().find(order => order.status === 'waiting')),
    openedOrderTotalPrice: computed(() => {
      const order = entities().find(order => order.status === 'waiting');
      return order?.cart.reduce((acc, item) => acc + (item.finalPrice || item.initPrice), 0);
    }),
  })),
  withMethods(
    (
      store,
      userOrderService = inject(LlecoopUserOrderFireService),
      storeNotificationService = inject(StoreNotificationService),
      orderListStore = inject(LLecoopOrderListStore),
      authService = inject(FirebaseAuthService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() =>
            userOrderService.getAll().pipe(
              tapResponse({
                next: orders => {
                  patchState(
                    store,
                    setAllEntities(orders, {
                      selectId: entity => entity.id || '',
                    }),
                    { loaded: true, lastUpdated: new Date() }
                  );
                },
                error: error => {
                  if (authService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar les comandes: ${error}`,
                      'ERROR'
                    );
                  }
                },
              })
            )
          )
        )
      ),
      create: rxMethod<Partial<LlecoopUserOrder>>(
        pipe(
          filter(() => !!authService.currentUser()?.uid && orderListStore.currentOrder() !== null),
          switchMap((order: Partial<LlecoopUserOrder>) => {
            const orderListId = orderListStore.currentOrder()?.id;
            const finalOrder = {
              ...order,
              orderListId,
            };
            return userOrderService.create(finalOrder, orderListId).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/soci/comanda'] }));
                  storeNotificationService.create(`Comanda creada`, 'SUCCESS');
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear la comanda": ${error}`,
                    'ERROR'
                  ),
              })
            );
          })
        )
      ),
      update: rxMethod<Partial<LlecoopUserOrder>>(
        pipe(
          switchMap(order => {
            return userOrderService.update(order).pipe(
              withLatestFrom(state.select(selectRouteUrl)),
              tapResponse({
                next: ([, routeDataName]) => {
                  const adminRegex = /admin\/comanda\/([^/]+)\/([^/]+)/;
                  let path = '/soci/comanda';

                  if (adminRegex.test(routeDataName)) {
                    const match = routeDataName.match(adminRegex);
                    path = match ? `/admin/comanda/${match[1]}` : '/admin/comanda';
                  }

                  state.dispatch(routerActions.go({ path: [path] }));
                },
                error: error => {
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar la comanda": ${error}`,
                    'ERROR'
                  );
                },
                complete: () => storeNotificationService.create(`Comanda actualitzada`, 'SUCCESS'),
              })
            );
          })
        )
      ),
      delete: rxMethod<LlecoopUserOrder>(
        pipe(
          switchMap(product => {
            return userOrderService.delete(product).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Comanda "${product.name}" eliminada. Recorda: sempre pots tornar a fer una comanda fins la data de tancament.`,
                    'INFO'
                  ),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar la comanda "${product.name}": ${error}`,
                    'ERROR'
                  ),
              })
            );
          })
        )
      ),
      setSorting: (sorting: OrderState['sorting']) => patchState(store, { sorting }),
      setSelectedItemId: (id: string | null) => {
        if (id !== store.selectedItemId()) {
          patchState(store, {
            selectedItemId: id,
          });
        }
      },
    })
  ),
  withHooks({
    onInit({ getAll, loaded }) {
      if (!loaded()) getAll();
    },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying user order store');
    },
  })
);
