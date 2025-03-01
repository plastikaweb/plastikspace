import { EMPTY, pipe, switchMap, withLatestFrom } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  StoreFirebaseCrudState,
  StoreNotificationService,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { llecoopOrderListStore } from './order-list-store';
import { LlecoopUserOrderFireService } from './user-order-fire.service';

export type StoreUserOrderFilter = StoreFirebaseCrudFilter & {
  text: string;
};

export type UserOrderListStoreCrudState = StoreFirebaseCrudState<
  LlecoopUserOrder,
  StoreUserOrderFilter
> & {
  orderProductsFilter: StoreUserOrderFilter;
  orderProductsSorting: TableSortingConfig;
  orderProductsPagination: StoreFirebaseCrudPagination<LlecoopOrderProduct>;
  currentUserOrder: LlecoopUserOrder | null;
  currentUserOrderInitialLoaded: boolean;
};

export const initUserOrderStoreFilter: StoreUserOrderFilter = {
  text: '',
};

export const initUserOrderStoreSorting = ['updatedAt', 'desc'] as TableSortingConfig;

export const initUserOrderStorePagination = {
  pageSize: 10,
  pageIndex: 0,
  pageLastElements: new Map<number, LlecoopUserOrder>(),
};

export const initUserOrderBaseState = initStoreFirebaseCrudState<
  LlecoopUserOrder,
  StoreUserOrderFilter
>(initUserOrderStoreFilter);

export const llecoopUserOrderStore = signalStore(
  { providedIn: 'root' },
  withState<UserOrderListStoreCrudState>({
    ...initUserOrderBaseState,
    orderProductsFilter: { text: '' },
    orderProductsSorting: ['normalizedName', 'desc'],
    orderProductsPagination: {
      pageSize: 10,
      pageIndex: 0,
      pageLastElements: new Map<number, LlecoopOrderProduct>(),
    },
    currentUserOrder: null,
    currentUserOrderInitialLoaded: false,
  }),
  withFirebaseCrud<LlecoopUserOrder, LlecoopUserOrderFireService, StoreUserOrderFilter>({
    featureName: 'user-order',
    dataServiceType: LlecoopUserOrderFireService,
    initFilter: initUserOrderStoreFilter,
    initSorting: initUserOrderStoreSorting,
    initPagination: initUserOrderStorePagination,
    baseRoute: '/soci/comanda',
  }),
  withMethods(
    (
      store,
      userOrderService = inject(LlecoopUserOrderFireService),
      storeNotificationService = inject(StoreNotificationService),
      orderListStore = inject(llecoopOrderListStore)
    ) => ({
      getCurrentUserOrder: rxMethod<void>(
        pipe(
          withLatestFrom(toObservable(orderListStore.currentOrderList)),
          switchMap(([, currentOrderList]) => {
            const id = currentOrderList?.id;

            if (id) {
              // Guardar el ID en una constante para evitar que sea undefined
              return userOrderService.getCurrentUserOrder(id).pipe(
                tapResponse({
                  next: currentUserOrder => {
                    updateState(store, `[user-order] get current user order`, {
                      currentUserOrder,
                      currentUserOrderInitialLoaded: true,
                    });
                  },
                  error: error => {
                    storeNotificationService.create(
                      `No s'ha pogut carregar la teva comanda actual: ${error}`,
                      'ERROR'
                    );
                  },
                })
              );
            }

            return EMPTY;
          })
        )
      ),
    })
  ),
  withHooks({
    onInit({ getCurrentUserOrder }) {
      const orderListStore = inject(llecoopOrderListStore);
      const currentUserOrderList = orderListStore.currentOrderList;

      effect(() => {
        if (currentUserOrderList()) {
          getCurrentUserOrder();
        }
      });
    },
  })
);
