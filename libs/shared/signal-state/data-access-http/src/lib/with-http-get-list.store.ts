import { updateState, withDevtools, withImmutableState } from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Type } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStoreFeature,
  SignalStoreFeature,
  withHooks,
  withMethods,
  withProps,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataGetList } from '@plastik/core/api-base';
import { BaseEntity } from '@plastik/core/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { debounceTime, distinctUntilChanged, pipe, switchMap } from 'rxjs';
import { HttpListResult } from './http-store.types';

export interface HttpGetListState {
  count: number;
}

const initialState = (): HttpGetListState => ({
  count: 0,
});

/**
 * Store feature for read-only list operations.
 * Use this when you only need to display a list of items.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with read-only list operations.
 */
export function withHttpGetList<T extends BaseEntity, S extends DataGetList<T, HttpListResult<T>>>({
  featureName,
  dataServiceType,
}: {
  featureName: string;
  dataServiceType: Type<S>;
}) {
  return signalStoreFeature(
    withDevtools(featureName),
    withImmutableState(initialState()),
    withEntities<T>(),
    withProps(() => ({
      _apiService: inject(dataServiceType),
      _storeNotificationService: inject(notificationStore),
    })),
    withMethods(store => {
      const showErrorNotification = (error: Error | HttpErrorResponse): void => {
        store._storeNotificationService.show({
          type: 'ERROR',
          message: error.message ?? `${featureName}.list.error`,
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
                        count: result.total,
                      }
                    );
                  },
                  error: error => {
                    updateState(store, `[${featureName}] loadList error`);
                    showErrorNotification(error as Error | HttpErrorResponse);
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
