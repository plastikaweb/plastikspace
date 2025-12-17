import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject, Type } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStoreFeature,
  SignalStoreFeature,
  type,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { EntityState, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataGet, DataGetList } from '@plastik/core/api-base';
import { BasePocketBaseEntity, IdType } from '@plastik/core/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { ClientResponseError, ListResult } from 'pocketbase';
import { debounceTime, filter, pipe, switchMap, tap } from 'rxjs';
import {
  initialGetListState,
  PocketBaseGetListState,
  PocketbaseGetOne,
  PocketBaseListParams,
} from './pocketbase-store.types';
import { withPocketBaseParamsFeature } from './stores/with-pocketbase-params.store';

/**
 * Store feature for list operations with PocketBase.
 * Use this when you only need to display a list of items.
 * @template T - The entity type.
 * @template S - The service type.
 * @param { object } root0 - Configuration object.
 * @param { string } root0.featureName - The name of the feature for DevTools.
 * @param { Type<S> } root0.dataServiceType - The service type for data operations.
 * @param { Partial<PocketBaseGetListState> } root0.customInitialState - The initial custom state.
 * @returns { SignalStoreFeature } A signal store feature with list operations.
 */
export function withPocketBaseListFeature<
  T extends BasePocketBaseEntity,
  S extends DataGetList<T, ListResult<T>>,
>({
  featureName,
  dataServiceType,
  customInitialState = {},
  autoLoad = true,
}: {
  featureName: string;
  dataServiceType: Type<S>;
  customInitialState?: Partial<PocketBaseGetListState>;
  autoLoad?: boolean;
}) {
  const defaultState = initialGetListState(customInitialState);

  return signalStoreFeature(
    withDevtools(featureName),
    withState<PocketBaseGetListState>({
      ...defaultState,
      listLoadingEnabled: autoLoad,
    }),
    withPocketBaseParamsFeature({ featureName, customInitialState }),
    withEntities<T>(),
    withProps(() => ({
      _apiService: inject(dataServiceType),
      _storeNotificationService: inject(notificationStore),
    })),
    withComputed(({ pagination, sort, filter }) => ({
      formattedParams: computed(() => {
        const s = sort();
        return {
          sort: s.direction === 'desc' ? `-${s.active}` : s.active,
          ...pagination(),
          ...filter(),
        };
      }),
      getPagination: computed<{ page: number; perPage: number }>(() => {
        return {
          page: ((pagination().page ?? defaultState.pagination.page) || 1) - 1,
          perPage: pagination().perPage ?? defaultState.pagination.perPage ?? 20,
        };
      }),
    })),

    withMethods(store => {
      const showNotification = (type: 'SUCCESS' | 'ERROR', message: string): void => {
        store._storeNotificationService.show({
          type,
          message,
          action: 'notification.close-short',
          duration: 5000,
        });
      };

      return {
        enableListLoading: (listLoadingEnabled = true) => {
          updateState(store, `[${featureName}] enableListLoading`, { listLoadingEnabled });
        },
        getList: rxMethod<ReturnType<typeof store.formattedParams>>(
          pipe(
            filter(() => store.listLoadingEnabled()),
            debounceTime(300),
            tap(() => updateState(store, `[${featureName}] getList`)),
            switchMap(params => {
              return store._apiService.getList(params).pipe(
                tapResponse<ListResult<T>, ClientResponseError>({
                  next: result => {
                    updateState(
                      store,
                      `[${featureName}] getList success`,
                      setAllEntities(result.items, {
                        selectId: entity => entity.id || '',
                      }),
                      {
                        count: result.totalItems,
                      }
                    );
                  },
                  error: error => {
                    showNotification('ERROR', error.message ?? `${featureName}.list.error`);
                  },
                })
              );
            })
          )
        ),
      };
    }),

    withHooks({
      onInit: store => {
        // Always subscribe to maintain reactivity - the filter will control execution
        store.getList(store.formattedParams);
      },
    })
  );
}

/**
 * Store feature for single item operations with PocketBase.
 * Use this when you only need to display a single item.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @returns {SignalStoreFeature} A signal store feature with single item operations.
 */
export function withPocketBaseGetOneFeature<
  T extends BasePocketBaseEntity,
  S extends DataGet<T, ListResult<T>, PocketBaseListParams>,
>({ featureName }: { featureName: string }) {
  return signalStoreFeature(
    {
      props: type<{
        _apiService: S;
        _storeNotificationService: InstanceType<typeof notificationStore>;
      }>(),
      state: type<EntityState<T>>(),
    },
    withState<PocketbaseGetOne<T>>({ selectedItemId: null as IdType<T> | null }),
    withMethods(store => {
      const showNotification = (type: 'SUCCESS' | 'ERROR', message: string): void => {
        store._storeNotificationService.show({
          type,
          message,
          action: 'notification.close-short',
          duration: 5000,
        });
      };

      return {
        getOne: rxMethod<IdType<T>>(
          pipe(
            tap(() => updateState(store, `[${featureName}] getOne`)),
            switchMap(id => {
              return store._apiService.getOne(id).pipe(
                tapResponse<T, ClientResponseError>({
                  next: item => {
                    updateState(
                      store,
                      `[${featureName}] getOne success`,
                      setEntity(item, {
                        selectId: entity => entity.id || '',
                      }),
                      {
                        selectedItemId: item.id as IdType<T>,
                      }
                    );
                  },
                  error: error => {
                    showNotification('ERROR', error.message ?? `${featureName}.getOne.error`);
                  },
                })
              );
            })
          )
        ),
      };
    })
  );
}
