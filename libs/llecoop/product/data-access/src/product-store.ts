import { pipe, switchMap, tap } from 'rxjs';

import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  watchState,
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
import {
  LlecoopFeatureStore,
  LlecoopFeatureStorePagination,
  StoreNotificationService,
} from '@plastik/llecoop/data-access';
import { LlecoopProduct, LlecoopProductWithUpdateNotification } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';

import { LlecoopProductFireService } from './product-fire.service';

export type ProductStoreFilter = {
  text: string;
  category: 'all' | string;
  inStock: 'all' | true | false;
};

type ProductStoreState = LlecoopFeatureStore<LlecoopProduct> & {
  filter: ProductStoreFilter;
};

export const LlecoopProductStore = signalStore(
  { providedIn: 'root' },
  withDevtools('product'),
  withState<ProductStoreState>({
    loaded: false,
    lastUpdated: new Date(),
    selectedItemId: null,
    sorting: ['updatedAt', 'desc'],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      pageLastElements: new Map<number, LlecoopProduct>(),
    },
    filter: {
      text: '',
      category: 'all',
      inStock: 'all',
    },
    count: 0,
  }),
  withEntities<LlecoopProduct>(),
  withComputed(({ selectedItemId, entityMap, entities }) => ({
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    getAvailableProducts: computed(() => {
      return entities().filter(product => product.isAvailable);
    }),
  })),
  withMethods(
    (
      store,
      productService = inject(LlecoopProductFireService),
      storeNotificationService = inject(StoreNotificationService),
      authService = inject(FirebaseAuthService),
      state = inject(Store)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            const pagination = store.pagination();
            const sorting = store.sorting();
            const filter = store.filter();

            return productService.getAll(pagination, sorting, filter).pipe(
              tapResponse({
                next: products => {
                  const pageLastElements = pagination?.pageLastElements?.set(
                    pagination.pageIndex,
                    products[products.length - 1]
                  );

                  patchState(
                    store,
                    setAllEntities(products, {
                      selectId: entity => entity.id || '',
                    }),
                    {
                      loaded: true,
                      lastUpdated: new Date(),
                      pagination: {
                        ...pagination,
                        pageLastElements,
                        pageIndex: pagination?.pageIndex ?? 0,
                        pageSize: pagination?.pageSize ?? 10,
                      },
                      sorting,
                    }
                  );
                },
                error: error => {
                  if (authService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar els productes: ${error}`,
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
      getCount: rxMethod<void>(
        pipe(
          switchMap(() => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            const filter = store.filter();
            return productService.getCount(filter).pipe(
              tapResponse({
                next: count => patchState(store, { count }),
                error: error => {
                  if (authService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar el total de productes: ${error}`,
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
      create: rxMethod<LlecoopProduct>(
        pipe(
          switchMap((product: LlecoopProduct) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return productService.create(product).pipe(
              tapResponse({
                next: () => state.dispatch(routerActions.go({ path: ['/admin/producte'] })),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
                complete: () =>
                  storeNotificationService.create(
                    `Producte "${product.name}" creat correctament`,
                    'SUCCESS'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      update: rxMethod<LlecoopProductWithUpdateNotification>(
        pipe(
          switchMap(({ product, showNotification }) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return productService.update(product).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/producte'] }));
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar el producte "${product['name']}": ${error}`,
                    'ERROR'
                  ),
                complete: () => {
                  if (showNotification) {
                    storeNotificationService.create(
                      `Producte "${product['name']}" actualitzat correctament`,
                      'SUCCESS'
                    );
                  }
                },
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProduct>(
        pipe(
          switchMap(product => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return productService.delete(product).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(`Producte "${product.name}" eliminat`, 'SUCCESS'),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar el producte "${product.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      setSorting: (sorting: LlecoopFeatureStore<LlecoopProduct>['sorting']) =>
        patchState(store, {
          sorting,
          pagination: { ...store.pagination(), pageIndex: 0, pageLastElements: new Map() },
        }),
      setPagination: (
        pagination: Pick<LlecoopFeatureStorePagination<LlecoopProduct>, 'pageIndex' | 'pageSize'>
      ) => {
        if (!pagination.pageIndex && !pagination.pageSize) return;
        const newPagination = {
          pageSize: pagination.pageSize ?? store.pagination()?.pageSize,
          pageIndex: pagination.pageIndex ?? store.pagination()?.pageIndex,
          pageLastElements:
            pagination.pageSize !== store.pagination()?.pageSize
              ? new Map()
              : store.pagination()?.pageLastElements,
        };
        patchState(store, { pagination: newPagination });
      },
      setFilter: (filter: ProductStoreFilter) =>
        patchState(store, {
          filter,
          pagination: { ...store.pagination(), pageIndex: 0, pageLastElements: new Map() },
        }),
      setSelectedItemId: (id: string | null) =>
        patchState(store, {
          selectedItemId: id,
        }),
    })
  ),
  withHooks({
    onInit(store) {
      const { getAll, getCount } = store;
      getCount();

      let previousPagination = store.pagination();
      let previousSorting = store.sorting();
      let previousFilter = store.filter();

      watchState(store, () => {
        const currentPagination = store.pagination();
        const currentSorting = store.sorting();
        const currentFilter = store.filter();
        if (
          !store.loaded() ||
          currentPagination.pageIndex !== previousPagination.pageIndex ||
          currentPagination.pageSize !== previousPagination.pageSize ||
          currentSorting !== previousSorting ||
          currentFilter !== previousFilter
        ) {
          getAll();
        }

        if (currentFilter !== previousFilter) {
          getCount();
        }

        previousPagination = currentPagination;
        previousSorting = currentSorting;
        previousFilter = currentFilter;
      });
    },
  })
);
