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
import { FormSelectOption } from '@plastik/core/entities';
import { routerActions } from '@plastik/core/router-state';
import {
  LlecoopFeatureStore,
  LlecoopFeatureStorePagination,
  StoreNotificationService,
} from '@plastik/llecoop/data-access';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';
import { activityActions } from '@plastik/shared/activity/data-access';

import { LlecoopCategoryFireService } from './category-fire.service';

export type CategoryStoreFilter = {
  text: string;
};

type CategoryStoreState = LlecoopFeatureStore<LlecoopProductCategory> & {
  filter: CategoryStoreFilter;
};

export const LlecoopCategoryStore = signalStore(
  { providedIn: 'root' },
  withDevtools('category'),
  withState<CategoryStoreState>({
    loaded: false,
    lastUpdated: new Date(),
    selectedItemId: null,
    sorting: ['updatedAt', 'desc'],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      pageLastElements: new Map<number, LlecoopProductCategory>(),
    },
    filter: {
      text: '',
    },
    count: 0,
  }),
  withEntities<LlecoopProductCategory>(),
  withComputed(({ entities, selectedItemId, entityMap }) => ({
    selectedItem: computed(() => {
      const id = selectedItemId();
      return id !== null ? entityMap()[id] : null;
    }),
    selectOptions: computed(() => {
      return entities()
        .map(category => ({
          label: category.name?.toLowerCase(),
          value: `category/${category.id}`,
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    }),
    selectByNameOptions: computed(() => {
      const options = entities()
        .map(category => ({
          label: category.name,
          value: `category/${category.id}`,
        }))
        .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
      return options as FormSelectOption[];
    }),
  })),
  withMethods(
    (
      store,
      categoryService = inject(LlecoopCategoryFireService),
      storeNotificationService = inject(StoreNotificationService),
      state = inject(Store),
      authService = inject(FirebaseAuthService)
    ) => ({
      getAll: rxMethod<void>(
        pipe(
          switchMap(() => {
            state.dispatch(activityActions.setActivity({ isActive: true }));
            const pagination = store.pagination();
            const sorting = store.sorting();
            const filter = store.filter();

            return categoryService.getAll(pagination, sorting, filter).pipe(
              tapResponse({
                next: categories => {
                  const pageLastElements = pagination?.pageLastElements?.set(
                    pagination.pageIndex,
                    categories[categories.length - 1]
                  );

                  patchState(
                    store,
                    setAllEntities(categories, {
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
                      `No s'ha pogut carregar les categories: ${error}`,
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
            return categoryService.getCount(filter).pipe(
              tapResponse({
                next: count => patchState(store, { count }),
                error: error => {
                  if (authService.loggedIn()) {
                    storeNotificationService.create(
                      `No s'ha pogut carregar el total de categories: ${error}`,
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
      create: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          switchMap((category: Partial<LlecoopProductCategory>) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryService.create(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  storeNotificationService.create(`Categoria "${category.name}" creada`, 'SUCCESS');
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut crear la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      update: rxMethod<Partial<LlecoopProductCategory>>(
        pipe(
          switchMap((category: Partial<LlecoopProductCategory>) => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryService.update(category).pipe(
              tapResponse({
                next: () => {
                  state.dispatch(routerActions.go({ path: ['/admin/categoria'] }));
                  storeNotificationService.create(
                    `Categoria "${category.name}" actualitzada`,
                    'SUCCESS',
                    false
                  );
                },
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut actualitzar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      delete: rxMethod<LlecoopProductCategory>(
        pipe(
          switchMap(category => {
            state.dispatch(activityActions.setActivity({ isActive: true }));

            return categoryService.delete(category).pipe(
              tapResponse({
                next: () =>
                  storeNotificationService.create(
                    `Categoria "${category.name}" eliminada`,
                    'SUCCESS'
                  ),
                error: error =>
                  storeNotificationService.create(
                    `No s'ha pogut eliminar la categoria "${category.name}": ${error}`,
                    'ERROR'
                  ),
              }),
              tap(() => state.dispatch(activityActions.setActivity({ isActive: false })))
            );
          })
        )
      ),
      setSorting: (sorting: LlecoopFeatureStore<LlecoopProductCategory>['sorting']) =>
        patchState(store, {
          sorting,
          pagination: { ...store.pagination(), pageIndex: 0, pageLastElements: new Map() },
        }),
      setPagination: (
        pagination: Pick<
          LlecoopFeatureStorePagination<LlecoopProductCategory>,
          'pageIndex' | 'pageSize'
        >
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
      setFilter: (filter: CategoryStoreFilter) =>
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
