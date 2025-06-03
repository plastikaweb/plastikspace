/* eslint-disable no-console */
import { filter, pipe, switchMap, tap } from 'rxjs';

import {
  updateState,
  withDevtools,
  withDisabledNameIndices,
  withGlitchTracking,
} from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject, Type } from '@angular/core';
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
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { BaseEntity } from '@plastik/core/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { areObjectEntriesEqual } from '@plastik/shared/objects';
import { TableSortingConfig } from '@plastik/shared/table/entities';

import { FirebaseServiceType } from './firebase-service.type';
import {
  StoreFirebaseCrudFilter,
  StoreFirebaseCrudPagination,
  StoreFirebaseCrudState,
} from './store-firebase-crud';
import { StoreNotificationService } from './store-notification.service';

export type StoreFirebaseCrudFeature<
  T extends BaseEntity,
  S extends FirebaseServiceType<T>,
  F extends StoreFirebaseCrudFilter,
  C extends StoreFirebaseCrudState<T, F>,
> = {
  featureName: string;
  dataServiceType: Type<S>;
  baseRoute?: StoreFirebaseCrudState<T, F>['baseRoute'];
  initState: C;
};

/**
 * @description Initializes the state for a signal store feature to implement entity CRUD operations with Firebase.
 * @template T The type of the entity.
 * @template F The type of the filter.
 * @param {F} [filter] The initial filter state.
 * @param {StoreFirebaseCrudPagination<T>} [pagination] The initial pagination state with pageIndex=0, pageSize=10 and empty pageLastElements.
 * @param {TableSortingConfig} [sorting] The initial sorting state.
 * @param {StoreFirebaseCrudState<T, F>['baseRoute']} [baseRoute] The base route for the feature used to navigate to the entity list, f.e. after creating or updating an entity.
 * @param {StoreFirebaseCrudState<T, F>['_adminOnly']} [_adminOnly] The initial admin only state.
 * @param {StoreFirebaseCrudState<T, F>['_public']} [_public] The initial public state.
 * @returns {StoreFirebaseCrudState<T, F>} The initial state for the signal store feature.
 */
export function initStoreFirebaseCrudState<T extends BaseEntity, F extends StoreFirebaseCrudFilter>(
  filter: F = {} as F,
  pagination: StoreFirebaseCrudPagination<T> = {
    pageIndex: 0,
    pageSize: 10,
    pageLastElements: new Map<number, T>(),
  },
  sorting: TableSortingConfig = ['updatedAt', 'desc'] as TableSortingConfig,
  baseRoute: StoreFirebaseCrudState<T, F>['baseRoute'] = '',
  _adminOnly: StoreFirebaseCrudState<T, F>['_adminOnly'] = true,
  _public: StoreFirebaseCrudState<T, F>['_public'] = false
): StoreFirebaseCrudState<T, F> {
  return {
    initiallyLoaded: false,
    _activeConnection: false,
    _lastUpdated: new Date(),
    selectedItemId: null,
    count: 0,
    showNotification: true,
    filter,
    pagination,
    sorting,
    baseRoute,
    _adminOnly,
    _public,
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
 * @returns {StoreFirebaseCrudFeature<T, S, F>} The signal store feature for CRUD operations with Firebase.
 */
export function withFirebaseCrud<
  T extends BaseEntity,
  S extends FirebaseServiceType<T>,
  F extends StoreFirebaseCrudFilter,
  C extends StoreFirebaseCrudState<T, F>,
>({ featureName, dataServiceType, initState }: StoreFirebaseCrudFeature<T, S, F, C>) {
  return signalStoreFeature(
    withDevtools(featureName, withGlitchTracking(), withDisabledNameIndices()),
    withState<StoreFirebaseCrudState<T, F>>(
      initStoreFirebaseCrudState(
        initState.filter,
        initState.pagination,
        initState.sorting,
        initState.baseRoute,
        initState._adminOnly,
        initState._public
      )
    ),
    withProps(() => ({
      _storeNotificationService: inject(StoreNotificationService),
      _authService: inject(FirebaseAuthService),
      _dataService: inject(dataServiceType) as S,
      _activityStore: inject(activityStore),
    })),
    withEntities<T>(),
    withComputed(store => {
      const { selectedItemId, entityMap } = store as {
        selectedItemId: () => EntityId | null;
        entityMap: () => Record<EntityId, T>;
      };

      return {
        selectedItem: computed(() => {
          const id = selectedItemId();
          return id !== null ? entityMap()[id] : null;
        }),
        selectedItemName: computed(() => {
          const id = selectedItemId();
          return id !== null ? entityMap()[id]?.name : '';
        }),
      };
    }),
    withMethods(store => {
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
        resetTableConfig: (
          pagination: Pick<StoreFirebaseCrudPagination<T>, 'pageSize' | 'pageIndex'>,
          filter: F,
          sorting: TableSortingConfig
        ) => {
          const newPagination = {
            pageSize: pagination.pageSize ?? store.pagination.pageSize(),
            pageIndex: pagination.pageIndex ?? store.pagination.pageIndex(),
            pageLastElements:
              pagination.pageSize !== store.pagination.pageSize()
                ? new Map()
                : store.pagination.pageLastElements(),
          };

          return updateState(store, `[${featureName}] reset table config`, {
            filter,
            pagination: newPagination,
            sorting,
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
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(() => {
              const filter = store.filter();

              return store._dataService.getCount(filter).pipe(
                tapResponse({
                  next: count => updateState(store, `[${featureName}] set count`, { count }),
                  error: error => {
                    console.error(error);
                    store._storeNotificationService.create(
                      `No s'ha pogut obtenir el total de elements de tipus '${featureName}'`,
                      'ERROR'
                    );
                    store._activityStore.setActivity(false);
                  },
                }),
                tap(() => store._activityStore.setActivity(false))
              );
            })
          )
        ),
        getAll: rxMethod<void>(
          pipe(
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(() => {
              return store._dataService
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
                      store._activityStore.setActivity(false);
                    },
                  }),
                  tap(() => store._activityStore.setActivity(false))
                );
            })
          )
        ),
        getItem: rxMethod<EntityId>(
          pipe(
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(id => {
              return store._dataService.getItem(id).pipe(
                tapResponse({
                  next: item => {
                    if (!item) {
                      const baseRoute = store.baseRoute();
                      const route = typeof baseRoute === 'string' ? baseRoute : baseRoute?.onError;
                      router.navigate([route]);
                      throw new Error();
                    }

                    updateState(
                      store,
                      `[${featureName}] get item with id ${id}`,
                      setEntity(item, { selectId: entity => entity.id || '' }),
                      {
                        selectedItemId: item.id || null,
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
                tap(() => store._activityStore.setActivity(false))
              );
            })
          )
        ),
        create: rxMethod<{ item: Partial<T>; redirectUrl?: string }>(
          pipe(
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(({ item, redirectUrl }) => {
              return store._dataService.create(item).pipe(
                tapResponse({
                  next: () => {
                    const baseRoute = store.baseRoute();
                    const route =
                      redirectUrl ||
                      (typeof baseRoute === 'string' ? baseRoute : baseRoute?.onCreate);
                    router.navigate([route]);
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
                tap(() => store._activityStore.setActivity(false))
              );
            })
          )
        ),
        update: rxMethod<{ item: Partial<T>; redirectUrl?: string }>(
          pipe(
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(({ item, redirectUrl }) => {
              return store._dataService.update(item).pipe(
                tapResponse({
                  next: () => {
                    const baseRoute = store.baseRoute();
                    const route =
                      redirectUrl ||
                      (typeof baseRoute === 'string' ? baseRoute : baseRoute?.onUpdate);
                    router.navigate([route]);
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
                tap(() => store._activityStore.setActivity(false))
              );
            })
          )
        ),
        delete: rxMethod<T>(
          pipe(
            filter(() => store._activeConnection()),
            tap(() => store._activityStore.setActivity(true)),
            switchMap(item => {
              return store._dataService.delete(item).pipe(
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
                tap(() => store._activityStore.setActivity(false))
              );
            })
          )
        ),
        setActive: (active: boolean) => {
          store._dataService.setActiveConnection(active);

          updateState(store, `[${featureName}] set active connection: ${active}`, {
            _activeConnection: active,
          });
        },
        destroy: () => {
          try {
            store._dataService.setActiveConnection(false);

            updateState(
              store,
              `[${featureName}] reset store`,
              setAllEntities(<T[]>[], {
                selectId: entity => entity.id || '',
              }),
              initState
            );
          } catch (error) {
            console.error(`${featureName} destroy error`, error);
          }
        },
      };
    }),
    withHooks({
      onInit(store) {
        const { getAll, setCount, initiallyLoaded } = store;

        let previousPagination = store.pagination();
        let previousSorting = store.sorting();
        let previousFilter = store.filter();

        const isAdmin = store._authService.isAdmin;

        watchState(store, () => {
          const currentPagination = store.pagination();
          const currentSorting = store.sorting();
          const currentFilter = store.filter();

          const isPaginationEqual =
            currentPagination.pageIndex === previousPagination.pageIndex &&
            currentPagination.pageSize === previousPagination.pageSize;
          const isSortingEqual =
            currentSorting[0] === previousSorting[0] && currentSorting[1] === previousSorting[1];
          const isFilterEqual = areObjectEntriesEqual(currentFilter, previousFilter);

          console.log('store', featureName);
          if (
            store._activeConnection() &&
            (store._public() || (store._adminOnly() && isAdmin()) || !store._adminOnly()) &&
            (!isPaginationEqual || !isSortingEqual || !isFilterEqual || !initiallyLoaded())
          ) {
            getAll();
          }

          if (
            store._activeConnection() &&
            (store._public() || (store._adminOnly() && isAdmin()) || !store._adminOnly()) &&
            (!isFilterEqual || !initiallyLoaded())
          ) {
            setCount();
          }

          previousPagination = currentPagination;
          previousSorting = currentSorting;
          previousFilter = currentFilter;
        });

        effect(() => {
          if (!store._authService.currentUser() && !store._public()) {
            store.destroy();
          } else if (!store._activeConnection()) {
            store.setActive(true);
          }
        });
      },
    })
  );
}
