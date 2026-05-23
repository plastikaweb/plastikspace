import { EMPTY, filter, pipe, switchMap, withLatestFrom } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
import { effect, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopOrderProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import { TableSortingConfig } from '@plastik/shared/table/entities';
import {
  FirebaseCrudFilter,
  FirebaseCrudPagination,
  FirebaseCrudState,
  initStoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/signal-state/firebase';

import { llecoopOrderListStore } from './order-list-store';
import { LlecoopUserOrderFireService } from './user-order-fire.service';

export type StoreUserOrderFilter = FirebaseCrudFilter & {
  text: string;
  userNormalizedName: string;
  status: LlecoopUserOrder['status'] | '';
  userId?: string | null;
};

export type StoreUserOrderProductsFilter = FirebaseCrudFilter & {
  text: string;
};

export type UserOrderListStoreCrudState = FirebaseCrudState<
  LlecoopUserOrder,
  StoreUserOrderFilter
> & {
  orderProductsFilter: StoreUserOrderProductsFilter;
  orderProductsSorting: TableSortingConfig;
  orderProductsPagination: FirebaseCrudPagination<LlecoopOrderProduct>;
  currentUserOrder: LlecoopUserOrder | null;
  currentUserOrderInitialLoaded: boolean;
};

type SpecificUserOrderListStoreFirebaseCrudState = Omit<
  UserOrderListStoreCrudState,
  keyof FirebaseCrudState<LlecoopUserOrder, StoreUserOrderFilter>
>;

export const userOrderMainInitState: FirebaseCrudState<LlecoopUserOrder, StoreUserOrderFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
    userNormalizedName: '',
    status: '',
    userId: null,
  },
  pagination: {
    pageSize: 25,
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
    FirebaseCrudState<LlecoopUserOrder, StoreUserOrderFilter>
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
  withMethods(store => ({
    getCurrentUserOrder: rxMethod<void>(
      pipe(
        filter(() => store._activeConnection() && store._currentOrderListInitialLoaded()),
        withLatestFrom(toObservable(store._currentOrderList)),
        switchMap(([, currentOrderList]) => {
          const id = currentOrderList?.id;

          if (id) {
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
  })),
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
