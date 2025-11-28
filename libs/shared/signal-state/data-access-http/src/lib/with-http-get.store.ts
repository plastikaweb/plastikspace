import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Type } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStoreFeature,
  SignalStoreFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataGet } from '@plastik/core/api-base';
import { BaseEntity, IdType } from '@plastik/core/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { debounceTime, distinctUntilChanged, pipe, switchMap } from 'rxjs';
import { HttpListResult } from './http-store.types';

export interface HttpGetState<T extends BaseEntity> {
  initiallyLoaded: boolean;
  count: number;
  selectedItemId: IdType<T> | null;
}

const initialState = <T extends BaseEntity>(): HttpGetState<T> => ({
  initiallyLoaded: false,
  count: 0,
  selectedItemId: null,
});

/**
 * Store feature for list + single item operations.
 * Use this when you need to display a list and view individual item details.
 * The service must return HttpListResult<T> format with items and total properties.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with list and single item operations.
 */
export function withHttpGet<T extends BaseEntity, S extends DataGet<T, HttpListResult<T>>>({
  featureName,
  dataServiceType,
}: {
  featureName: string;
  dataServiceType: Type<S>;
}) {
  return signalStoreFeature(
    withDevtools(featureName),
    withState(initialState<T>()),
    withEntities<T>(),
    withProps(() => ({
      _apiService: inject(dataServiceType),
      _storeNotificationService: inject(notificationStore),
    })),
    withMethods(store => {
      const showErrorNotification = (error: Error | HttpErrorResponse, operation: string): void => {
        store._storeNotificationService.show({
          type: 'ERROR',
          message: error.message ?? `${featureName}.${operation}.error`,
          action: 'notification.close-short',
          duration: 5000,
        });
      };

      return {
        getList: rxMethod<Record<string, unknown>>(
          pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(params => {
              updateState(store, `[${featureName}] loadList`);

              return store._apiService.getList(params).pipe(
                tapResponse<HttpListResult<T>>({
                  next: result => {
                    updateState(
                      store,
                      `[${featureName}] loadList success`,
                      setAllEntities(result.items, {
                        selectId: entity => entity.id || '',
                      }),
                      {
                        initiallyLoaded: true,
                        count: result.total,
                      }
                    );
                  },
                  error: error => {
                    updateState(store, `[${featureName}] loadList error`);
                    showErrorNotification(error as Error | HttpErrorResponse, 'list');
                  },
                })
              );
            })
          )
        ),

        getOne: rxMethod<IdType<T>>(
          pipe(
            switchMap(id => {
              updateState(store, `[${featureName}] getOne`);

              return store._apiService.getOne(id).pipe(
                tapResponse<T>({
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
                    updateState(store, `[${featureName}] getOne error`);
                    showErrorNotification(error as Error | HttpErrorResponse, 'getOne');
                  },
                })
              );
            })
          )
        ),
      };
    }),
    withHooks({
      onInit: () => {
        // Optional: Auto-load can be triggered here or manually
      },
    })
  );
}
