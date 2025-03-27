import { EMPTY, filter, pipe, switchMap, withLatestFrom } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { llecoopOrderListStore } from './order-list-store';
import { LlecoopUserOrderFireService } from './user-order-fire.service';

export type StoreUserOrderFilter = StoreFirebaseCrudFilter & {
  text: string;
  userName: string;
  status: LlecoopUserOrder['status'] | '';
};

export type StoreUserOrderProductsFilter = StoreFirebaseCrudFilter & {
  text: string;
};

export type UserOrderListStoreCrudState = StoreFirebaseCrudState<
  LlecoopUserOrder,
  StoreUserOrderFilter
> & {
  orderProductsFilter: StoreUserOrderProductsFilter;
  orderProductsSorting: TableSortingConfig;
  orderProductsPagination: StoreFirebaseCrudPagination<LlecoopOrderProduct>;
  currentUserOrder: LlecoopUserOrder | null;
  currentUserOrderInitialLoaded: boolean;
};

type SpecificUserOrderListStoreFirebaseCrudState = Omit<
  UserOrderListStoreCrudState,
  keyof StoreFirebaseCrudState<LlecoopUserOrder, StoreUserOrderFilter>
>;

export const userOrderMainInitState: StoreFirebaseCrudState<
  LlecoopUserOrder,
  StoreUserOrderFilter
> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
    userName: '',
    status: '',
  },
  pagination: {
    pageSize: 5,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopUserOrder>(),
  },
  sorting: ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: '/comandes',
  _adminOnly: false,
};

const specificInitState: SpecificUserOrderListStoreFirebaseCrudState = {
  orderProductsFilter: { text: '' },
  orderProductsSorting: ['normalizedName', 'desc'],
  orderProductsPagination: {
    pageSize: 10,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopOrderProduct>(),
  },
  currentUserOrder: null,
  currentUserOrderInitialLoaded: false,
};

export const llecoopUserOrderStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<
    LlecoopUserOrder,
    LlecoopUserOrderFireService,
    StoreUserOrderFilter,
    StoreFirebaseCrudState<LlecoopUserOrder, StoreUserOrderFilter>
  >({
    featureName: 'user-order',
    dataServiceType: LlecoopUserOrderFireService,
    initState: { ...userOrderMainInitState, ...specificInitState },
  }),
  withState<SpecificUserOrderListStoreFirebaseCrudState>(specificInitState),
  withProps(() => ({
    _currentOrderList: inject(llecoopOrderListStore).currentOrderList,
    _currentOrderListInitialLoaded: inject(llecoopOrderListStore).currentOrderListInitialLoaded,
  })),
  withMethods(store => {
    return {
      getCurrentUserOrder: rxMethod<void>(
        pipe(
          filter(() => store._activeConnection() && store._currentOrderListInitialLoaded()),
          withLatestFrom(toObservable(store._currentOrderList)),
          switchMap(([, currentOrderList]) => {
            const id = currentOrderList?.id;

            if (id) {
              // Guardar el ID en una constante para evitar que sea undefined
              return store._dataService.getCurrentUserOrder(id).pipe(
                tapResponse({
                  next: currentUserOrder => {
                    updateState(store, `[user-order] get current user order`, {
                      currentUserOrder,
                      currentUserOrderInitialLoaded: true,
                    });
                  },
                  error: error => {
                    store._storeNotificationService.create(
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
    };
  }),
  withHooks({
    onInit({ getCurrentUserOrder, _activeConnection, _currentOrderListInitialLoaded }) {
      effect(() => {
        if (_activeConnection() && _currentOrderListInitialLoaded()) {
          getCurrentUserOrder();
        }
      });
    },
  })
);
