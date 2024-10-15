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
import { withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { routerActions } from '@plastik/core/router-state';
import { LlecoopFeatureStore, StoreNotificationService } from '@plastik/llecoop/data-access';
import { LlecoopProductCategory, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { LLecoopOrderListStore } from '@plastik/llecoop/order-list/data-access';
import { activityActions } from '@plastik/shared/activity/data-access';
import { filter, pipe, switchMap, tap } from 'rxjs';
import { LlecoopOrderFireService } from './order-fire.service';

type OrderState = LlecoopFeatureStore;

export const LlecoopOrderStore = signalStore(
  { providedIn: 'root' },
  withDevtools('orders'),
  withState<OrderState>({
    loaded: false,
    lastUpdated: new Date(),
    sorting: ['name', 'asc'],
    selectedItemId: null,
  }),
  withEntities<LlecoopUserOrder>(),
  withComputed(({ ids, selectedItemId, entityMap }) => ({
    count: computed(() => ids().length),
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
  })),
  withMethods(
    (
      store,
      orderService = inject(LlecoopOrderFireService),
      storeNotificationService = inject(StoreNotificationService),
      orderListStore = inject(LLecoopOrderListStore),
      authService = inject(FirebaseAuthService),
      state = inject(Store)
    ) => ({
      create: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          filter(() => !!authService.currentUser()?.uid && orderListStore.currentOrder() !== null),
          tap(() => state.dispatch(activityActions.setActivity({ isActive: true }))),
          switchMap((order: Partial<LlecoopUserOrder>) => {
            const orderListId = orderListStore.currentOrder()?.id;
            const userId = authService.currentUser()?.uid;
            const finalOrder = {
              ...order,
              orderListId,
              userId,
            };
            return orderService.create(finalOrder, orderListId, userId).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  state.dispatch(routerActions.go({ path: ['/soci/order'] }));
                  storeNotificationService.create(`Comanda creada`, 'SUCCESS');
                },
                error: error => {
                  state.dispatch(activityActions.setActivity({ isActive: false }));
                  storeNotificationService.create(
                    `No s'ha pogut crear la comanda": ${error}`,
                    'ERROR'
                  );
                },
              })
            );
          })
        )
      ),
      setSorting: (sorting: OrderState['sorting']) => patchState(store, { sorting }),
      setSelectedItemId: (id: string | null) =>
        patchState(store, {
          selectedItemId: id,
        }),
    })
  ),
  withHooks({
    // onInit({ getAll, loaded }) {
    //   if (!loaded()) getAll();
    // },
    onDestroy() {
      // eslint-disable-next-line no-console
      console.log('Destroying order store');
    },
  })
);
