import { EMPTY, filter, pipe, switchMap, tap } from 'rxjs';

import { updateState } from '@angular-architects/ngrx-toolkit';
/* eslint-disable no-console */
import { computed, effect } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EntityId, SelectEntityId, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { LlecoopOrder, LlecoopProduct, LlecoopUserOrder } from '@plastik/llecoop/entities';
import {
  initStoreFirebaseCrudState,
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  StoreFirebaseCrudState,
  withFirebaseCrud,
} from '@plastik/shared/signal-state-data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { LlecoopOrderListFireService } from './order-list-fire.service';

export type StoreOrderListFilter = StoreFirebaseCrudFilter & {
  text: string;
};

export type OrderListStoreFirebaseCrudState = StoreFirebaseCrudState<
  LlecoopOrder,
  StoreOrderListFilter
> & {
  selectedItemUserOrderId: EntityId | null;
  currentOrderList: LlecoopOrder | null;
  currentOrderListInitialLoaded: boolean;
  selectedItemUserFilter: StoreOrderListFilter;
  selectedItemUserSorting: TableSortingConfig;
  selectedItemUserPagination: StoreFirebaseCrudPagination<LlecoopUserOrder>;
  availableProducts: LlecoopProduct[];
};

type SpecificOrderListStoreFirebaseCrudState = Omit<
  OrderListStoreFirebaseCrudState,
  keyof StoreFirebaseCrudState<LlecoopOrder, StoreOrderListFilter>
>;

export const orderListMainInitState: StoreFirebaseCrudState<LlecoopOrder, StoreOrderListFilter> = {
  ...initStoreFirebaseCrudState(),
  filter: {
    text: '',
  },
  pagination: {
    pageSize: 5,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopOrder>(),
  },
  sorting: ['createdAt', 'desc'] as TableSortingConfig,
  baseRoute: 'admin/comanda',
};

const specificInitState: SpecificOrderListStoreFirebaseCrudState = {
  selectedItemUserOrderId: null,
  currentOrderList: null,
  currentOrderListInitialLoaded: false,
  selectedItemUserFilter: { text: '' },
  selectedItemUserSorting: ['userName', 'desc'],
  selectedItemUserPagination: {
    pageSize: 5,
    pageIndex: 0,
    pageLastElements: new Map<number, LlecoopUserOrder>(),
  },
  availableProducts: [],
};

const selectId: SelectEntityId<LlecoopOrder> = orderList => orderList?.id || '';

export const llecoopOrderListStore = signalStore(
  { providedIn: 'root' },
  withFirebaseCrud<
    LlecoopOrder,
    LlecoopOrderListFireService,
    StoreOrderListFilter,
    StoreFirebaseCrudState<LlecoopOrder, StoreOrderListFilter>
  >({
    featureName: 'order-list',
    dataServiceType: LlecoopOrderListFireService,
    initState: { ...orderListMainInitState, ...specificInitState },
  }),
  withState<SpecificOrderListStoreFirebaseCrudState>(specificInitState),
  withComputed(({ selectedItemId, selectedItemUserOrderId, entityMap, currentOrderList }) => ({
    currentOrderCount: computed(() => currentOrderList()?.availableProducts.length || 0),
    currentOrderAvailableProducts: computed(() => currentOrderList()?.availableProducts || []),
    selectedItemUserOrder: computed(() => {
      const id = selectedItemId();
      const selectedOrderList = id !== null ? entityMap()[id] : null;
      return selectedOrderList && selectedOrderList.orders
        ? selectedOrderList.orders.find(order => order.id === selectedItemUserOrderId())
        : null;
    }),
  })),
  withMethods(store => ({
    changeStatus: rxMethod<LlecoopOrder>(
      pipe(
        filter(() => !!store._activeConnection()),
        switchMap(order => {
          store._storeNotificationService.create(
            `Estat de la comanda "${order['name']}" actualitzat correctament`,
            'SUCCESS'
          );

          return store._dataService
            .update({ ...order, status: order.status === 'progress' ? 'waiting' : 'progress' })
            .pipe(
              tapResponse({
                next: () => {
                  store._storeNotificationService.create(
                    `Estat de la comanda "${order['name']}" actualitzat correctament`,
                    'SUCCESS'
                  );
                },
                error: error =>
                  store._storeNotificationService.create(
                    `No s'ha pogut actualitzar l'estat de la comanda "${order['name']}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() =>
                store._storeNotificationService.create(
                  `Estat de la comanda "${order['name']}" actualitzat correctament`,
                  'SUCCESS'
                )
              )
            );
        })
      )
    ),
    cancel: rxMethod<LlecoopOrder>(
      pipe(
        filter(() => !!store._activeConnection()),
        switchMap(order => {
          store._storeNotificationService.create(
            `Estat de la comanda "${order['name']}" cancel·lada correctament`,
            'SUCCESS'
          );

          return store._dataService.update({ ...order, status: 'cancel' }).pipe(
            tapResponse({
              next: () =>
                store._storeNotificationService.create(
                  `Comanda "${order['name']}" cancel·lada correctament`,
                  'SUCCESS'
                ),
              error: error =>
                store._storeNotificationService.create(
                  `No s'ha pogut cancel·lar la comanda "${order['name']}": ${error}`,
                  'ERROR'
                ),
            }),
            tap(() =>
              store._storeNotificationService.create(
                `Estat de la comanda "${order['name']}" cancel·lada correctament`,
                'SUCCESS'
              )
            )
          );
        })
      )
    ),
    getAllOrderListOrders: rxMethod<Partial<void>>(
      pipe(
        filter(() => !!store._activeConnection()),
        switchMap(() => {
          const pagination = store.selectedItemUserPagination();
          const filter = store.selectedItemUserFilter();
          const sorting = store.selectedItemUserSorting();
          const id = store.selectedItemId();

          if (!id) return EMPTY;

          return store._dataService.getAllByOrderListId(id, pagination, sorting, filter).pipe(
            tapResponse({
              next: orders => {
                updateState(
                  store,
                  `[order-list] get orders for selected order list with id ${id}`,
                  updateEntity({ id, changes: { orders } }, { selectId })
                );

                const pageLastElements = store
                  .selectedItemUserPagination()
                  ?.pageLastElements?.set(
                    store.selectedItemUserPagination()?.pageIndex,
                    orders[orders.length - 1]
                  );
                updateState(
                  store,
                  `[order-list] update pagination for selected order list with id ${id}`,
                  {
                    selectedItemUserPagination: {
                      ...pagination,
                      pageLastElements,
                    },
                  }
                );
              },
              error: error =>
                store._storeNotificationService.create(
                  `No s'ha pogut carregar el llistat de comandes: ${error}`,
                  'ERROR'
                ),
            })
          );
        })
      )
    ),
    getCurrentOrderList: rxMethod<void>(
      pipe(
        filter(() => store._activeConnection() && !store.currentOrderListInitialLoaded()),
        switchMap(() => {
          return store._dataService.getCurrentOrderList().pipe(
            tapResponse({
              next: currentOrderList =>
                updateState(store, `[order-list] get current order List`, {
                  currentOrderList,
                  currentOrderListInitialLoaded: true,
                }),
              error: error => {
                store._storeNotificationService.create(
                  `No s'ha pogut carregar la comanda actual: ${error}`,
                  'ERROR'
                );
              },
            })
          );
        })
      )
    ),
    getAvailableProducts: rxMethod<void>(
      pipe(
        filter(() => !!store._activeConnection()),
        switchMap(() => {
          return store._dataService.getAvailableProducts().pipe(
            tapResponse({
              next: availableProducts =>
                updateState(store, `[order-list] get available products`, {
                  availableProducts,
                }),
              error: error => {
                store._storeNotificationService.create(
                  `No s'ha pogut carregar els productes disponibles: ${error}`,
                  'ERROR'
                );
              },
            })
          );
        })
      )
    ),
    clearAvailableProducts: () =>
      updateState(store, `[order-list] clear available products`, {
        availableProducts: [],
      }),
    getItemById: (id: EntityId) => store.entityMap()[id],
    setSelectedItemUserOrderId: (id: EntityId | null) =>
      updateState(store, `[order-list] set selected User Order id`, {
        selectedItemUserOrderId: id,
      }),
    setSelectedItemUserFilter: (filter: StoreOrderListFilter) =>
      updateState(store, `[order-list] update selected order List filter`, {
        selectedItemUserFilter: filter,
        selectedItemUserPagination: {
          ...store.selectedItemUserPagination(),
          pageIndex: 0,
          pageLastElements: new Map(),
        },
      }),
    setSelectedItemUserSorting: (sorting: TableSortingConfig) =>
      updateState(store, `[order-list] set selected order List sorting`, {
        selectedItemUserSorting: sorting,
      }),
    setSelectedItemUserPagination: (
      pagination: Pick<StoreFirebaseCrudPagination<LlecoopOrder>, 'pageIndex' | 'pageSize'>
    ) => {
      const newPagination = {
        pageSize: pagination.pageSize ?? store.selectedItemUserPagination().pageSize,
        pageIndex: pagination.pageIndex ?? store.selectedItemUserPagination().pageIndex,
        pageLastElements:
          pagination.pageSize !== store.selectedItemUserPagination().pageSize
            ? new Map()
            : store.selectedItemUserPagination.pageLastElements(),
      };

      updateState(store, `[order-list] set selected order List pagination`, {
        selectedItemUserPagination: newPagination,
      });
    },
  })),
  withHooks({
    onInit(store) {
      let previousSelectedItemId = store.selectedItemId();
      let previousSelectedItemUserFilter = store.selectedItemUserFilter();
      let previousSelectedItemUserSorting = store.selectedItemUserSorting();
      let previousSelectedItemUserPagination = store.selectedItemUserPagination();

      watchState(store, () => {
        const currentSelectedItemId = store.selectedItemId();
        const currentSelectedItemUserFilter = store.selectedItemUserFilter();
        const currentSelectedItemUserSorting = store.selectedItemUserSorting();
        const currentSelectedItemUserPagination = store.selectedItemUserPagination();
        if (
          store._activeConnection() &&
          (currentSelectedItemId !== previousSelectedItemId ||
            currentSelectedItemUserFilter !== previousSelectedItemUserFilter ||
            currentSelectedItemUserSorting !== previousSelectedItemUserSorting ||
            currentSelectedItemUserPagination.pageIndex !==
              previousSelectedItemUserPagination.pageIndex ||
            currentSelectedItemUserPagination.pageSize !==
              previousSelectedItemUserPagination.pageSize)
        ) {
          store.getAllOrderListOrders();
        }

        previousSelectedItemId = currentSelectedItemId;
        previousSelectedItemUserFilter = currentSelectedItemUserFilter;
        previousSelectedItemUserSorting = currentSelectedItemUserSorting;
        previousSelectedItemUserPagination = currentSelectedItemUserPagination;
      });

      effect(onCleanup => {
        if (store._activeConnection() && !store.currentOrderListInitialLoaded()) {
          store.getCurrentOrderList();
        }
        onCleanup(() => {
          console.log('order-list getCurrentOrderList cleanup');
        });
      });
    },
  })
);
