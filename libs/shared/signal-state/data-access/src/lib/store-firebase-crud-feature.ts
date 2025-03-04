/* eslint-disable no-console */
import { pipe, switchMap, tap } from 'rxjs';

import { updateState, withDevtools, withGlitchTracking } from '@angular-architects/ngrx-toolkit';
import { computed, inject, Type } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import {
  signalStoreFeature,
  watchState,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { EntityId, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { BaseEntity } from '@plastik/core/entities';
import { activityActions } from '@plastik/shared/activity/data-access';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { FirebaseServiceType } from './firebase-service.type';
import {
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  StoreFirebaseCrudState,
} from './store-firebase-crud';
import { StoreNotificationService } from './store-notification.service';

export interface StoreFirebaseCrudFeature<
  T extends BaseEntity,
  S extends FirebaseServiceType<T>,
  F extends StoreFirebaseCrudFilter,
> {
  featureName: string;
  dataServiceType: Type<S>;
  initFilter?: F;
  initPagination?: {
    pageIndex: number;
    pageSize: number;
    pageLastElements: Map<number, T>;
  };
  initSorting?: TableSortingConfig;
  showNotification?: boolean;
  baseRoute?: string;
}

/**
 * @description Initializes the state of a signal store feature for entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template F The type of the filter.
 * @param {F} filter The filter configuration.
 * @param {StoreFirebaseCrudPagination<T>} pagination The pagination configuration.
 * @param {TableSortingConfig} sorting The sorting configuration.
 * @param {string} baseRoute The base route of the feature.
 * @returns {StoreFirebaseCrudState<T, F>} The initialized state.
 */
export function initStoreFirebaseCrudState<T extends BaseEntity, F extends StoreFirebaseCrudFilter>(
  filter: F = {} as F,
  pagination: StoreFirebaseCrudPagination<T> = {
    pageIndex: 0,
    pageSize: 10,
    pageLastElements: new Map<number, T>(),
  },
  sorting: TableSortingConfig = ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute = ''
): StoreFirebaseCrudState<T, F> {
  return {
    initiallyLoaded: false,
    _lastUpdated: new Date(),
    filter,
    pagination,
    sorting,
    count: 0,
    selectedItemId: null,
    showNotification: true,
    baseRoute,
  };
}

/**
 * @description A signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template S The type of the Firebase service.
 * @template F The type of the filter.
 * @param {StoreFirebaseCrudFeature<T, S, F>} options The configuration options
 * @param {string} options.featureName The name of the feature.
 * @param {Type<S>} options.dataServiceType The type of the Firebase service.
 * @param {F} [options.initFilter] The initial filter state.
 * @param {StoreFirebaseCrudPagination<T>} [options.initPagination] The initial pagination state.
 * @param {TableSortingConfig} [options.initSorting] The initial sorting state.
 * @returns {StoreFirebaseCrudFeature<T, S, F>} The signal store feature for CRUD operations with Firebase.
 */
export function withFirebaseCrud<
  T extends BaseEntity,
  S extends FirebaseServiceType<T>,
  F extends StoreFirebaseCrudFilter,
>({
  featureName,
  dataServiceType,
  initFilter = {} as F,
  initPagination = {
    pageIndex: 0,
    pageSize: 10,
    pageLastElements: new Map<number, T>(),
  },
  initSorting = ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute = '',
}: StoreFirebaseCrudFeature<T, S, F>) {
  return signalStoreFeature(
    withDevtools(featureName, withGlitchTracking()),
    withState<StoreFirebaseCrudState<T, F>>(
      initStoreFirebaseCrudState(initFilter, initPagination, initSorting, baseRoute)
    ),
    withProps(() => ({
      _storeNotificationService: inject(StoreNotificationService),
      _state: inject(Store),
    })),
    withEntities<T>(),
    withComputed(({ selectedItemId, entityMap }) => ({
      selectedItem: computed(() => {
        const id = selectedItemId();
        return id !== null ? entityMap()[id] : null;
      }),
    })),
    withMethods(store => {
      const dataService = inject(dataServiceType) as S;
      const router = inject(Router);

      return {
        setFilter: (filter: F) =>
          updateState(store, `[${featureName}] set filter`, {
            filter,
            pagination: { ...store.pagination(), pageIndex: 0, pageLastElements: new Map() },
          }),
        setPagination: (
          pagination: Pick<StoreFirebaseCrudPagination<T>, 'pageIndex' | 'pageSize'>
        ) => {
          const newPagination = {
            pageSize: pagination.pageSize ?? store.pagination.pageSize(),
            pageIndex: pagination.pageIndex ?? store.pagination.pageIndex(),
            pageLastElements:
              pagination.pageSize !== store.pagination.pageSize()
                ? new Map()
                : store.pagination.pageLastElements(),
          };

          updateState(store, `[${featureName}] set pagination`, {
            pagination: newPagination,
          });
        },
        setSorting: (sorting: TableSortingConfig) =>
          updateState(store, `[${featureName}] set sorting`, {
            sorting,
            pagination: { ...store.pagination(), pageIndex: 0, pageLastElements: new Map() },
          }),
        setShowNotification: (showNotification: boolean) =>
          updateState(store, `[${featureName}] set show notification`, {
            showNotification,
          }),
        setSelectedItemId: (selectedItemId: EntityId | null) =>
          updateState(store, `[${featureName}] set selected id`, {
            selectedItemId,
          }),
        setCount: rxMethod<void>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap(() => {
              const filter = store.filter();
              return dataService.getCount(filter).pipe(
                tapResponse({
                  next: count => updateState(store, `[${featureName}] set count`, { count }),
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      `No s'ha pogut obtenir el total de elements de tipus '${featureName}'`,
                      'ERROR'
                    );
                  },
                }),
                tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            })
          )
        ),
        getAll: rxMethod<void>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap(() => {
              return dataService
                .getAll(store.pagination(), store.sorting(), store.filter() as F)
                .pipe(
                  tapResponse({
                    next: entities => {
                      const pageLastElements = store
                        .pagination()
                        ?.pageLastElements?.set(
                          store.pagination().pageIndex,
                          entities[entities.length - 1]
                        );

                      updateState(
                        store,
                        `[${featureName}] load entities`,
                        setAllEntities(entities, {
                          selectId: entity => entity.id || '',
                        }),
                        {
                          initiallyLoaded: true,
                          _lastUpdated: new Date(),
                          pagination: {
                            ...store.pagination(),
                            pageLastElements,
                            pageIndex: store.pagination()?.pageIndex ?? 0,
                            pageSize: store.pagination()?.pageSize ?? 10,
                          },
                          sorting: store.sorting(),
                        }
                      );
                    },
                    error: error => {
                      console.error(error);
                      store._storeNotificationService.create(
                        `No s'ha pogut carregar els elements de tipus '${featureName}'`,
                        'ERROR'
                      );
                    },
                  }),
                  tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
                );
            })
          )
        ),
        getItem: rxMethod<EntityId>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap(id => {
              return dataService.getItem(id).pipe(
                tapResponse({
                  next: item => {
                    if (!item) {
                      updateState(store, `[${featureName}] get item with id ${id} not found`, {
                        selectedItemId: null,
                        initiallyLoaded: false,
                      });
                      router.navigate([store.baseRoute()]);
                      throw new Error();
                    }

                    updateState(
                      store,
                      `[${featureName}] get item with id ${id}`,
                      setEntity(item, { selectId: entity => entity.id || '' }),
                      {
                        selectedItemId: item.id || '',
                        initiallyLoaded: false,
                      }
                    );
                  },
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      `No s'ha pogut carregar l'element de tipus '${featureName}' amb id ${id}`,
                      'ERROR'
                    );
                  },
                }),
                tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            })
          )
        ),
        create: rxMethod<Partial<T>>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap((item: Partial<T>) => {
              return dataService.create(item).pipe(
                tapResponse({
                  next: () => {
                    router.navigate([store.baseRoute()]);
                    if (store.showNotification()) {
                      store._storeNotificationService.create(
                        item.name ? `S'ha creat "${item.name}"` : `S'ha creat el nou element`,
                        'SUCCESS'
                      );
                    }

                    if (!store.showNotification()) {
                      updateState(store, `[${featureName}] reset show notification`, {
                        showNotification: true,
                      });
                    }
                  },
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      item.name
                        ? `No s'ha pogut crear "${item.name}"`
                        : `No s'ha pogut crear el nou element`,
                      'ERROR'
                    );
                  },
                }),
                tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            })
          )
        ),
        update: rxMethod<Partial<T>>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap((item: Partial<T>) => {
              return dataService.update(item).pipe(
                tapResponse({
                  next: () => {
                    router.navigate([store.baseRoute()]);
                    if (store.showNotification()) {
                      store._storeNotificationService.create(
                        item.name
                          ? `S'ha actualitzat "${item.name}"`
                          : `S'ha actualitzat el element`,
                        'SUCCESS'
                      );
                    }

                    if (!store.showNotification()) {
                      updateState(store, `[${featureName}] reset show notification`, {
                        showNotification: true,
                      });
                    }
                  },
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      item.name
                        ? `No s'ha pogut actualitzar "${item.name}"`
                        : `No s'ha pogut actualitzar el element`,
                      'ERROR'
                    );
                  },
                }),
                tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            })
          )
        ),
        delete: rxMethod<T>(
          pipe(
            tap(() => store._state.dispatch(activityActions.setActivity({ isActive: true }))),
            switchMap(item => {
              return dataService.delete(item).pipe(
                tapResponse({
                  next: () => {
                    if (store.showNotification()) {
                      store._storeNotificationService.create(
                        item.name ? `S'ha eliminat "${item.name}"` : `S'ha eliminat el element`,
                        'SUCCESS'
                      );
                    }

                    if (!store.showNotification()) {
                      updateState(store, `[${featureName}] reset show notification`, {
                        showNotification: true,
                      });
                    }
                  },
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      item.name
                        ? `No s'ha pogut eliminar "${item.name}"`
                        : `No s'ha pogut eliminar el element`,
                      'ERROR'
                    );
                  },
                }),
                tap(() => store._state.dispatch(activityActions.setActivity({ isActive: false })))
              );
            })
          )
        ),
      };
    }),
    withHooks({
      onInit(store) {
        const { getAll, setCount } = store;

        let previousPagination = store.pagination();
        let previousSorting = store.sorting();
        let previousFilter = store.filter();

        watchState(store, () => {
          const currentPagination = store.pagination();
          const currentSorting = store.sorting();
          const currentFilter = store.filter();

          if (
            currentPagination.pageIndex !== previousPagination.pageIndex ||
            currentPagination.pageSize !== previousPagination.pageSize ||
            currentSorting !== previousSorting ||
            currentFilter !== previousFilter
          ) {
            getAll();
          }

          if (currentFilter !== previousFilter) {
            setCount();
          }

          previousPagination = currentPagination;
          previousSorting = currentSorting;
          previousFilter = currentFilter;
        });
      },
    })
  );
}
