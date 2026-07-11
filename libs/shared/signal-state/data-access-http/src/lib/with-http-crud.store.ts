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
import {
  addEntity,
  removeEntity,
  setAllEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataCrud } from '@plastik/core/api-base';
import { BaseEntity, IdType } from '@plastik/core/entities';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { debounceTime, distinctUntilChanged, pipe, switchMap } from 'rxjs';
import { HttpListResult } from './http-store.types';

export interface HttpCrudState<T extends BaseEntity> {
  count: number;
  error: string | null;
  selectedItemId: IdType<T> | null;
}

const initialState = <T extends BaseEntity>(): HttpCrudState<T> => ({
  count: 0,
  error: null,
  selectedItemId: null,
});

/**
 * Store feature for full CRUD operations.
 * Use this when you need complete create, read, update, delete functionality.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with full CRUD operations.
 */
export function withHttpCrud<T extends BaseEntity, S extends DataCrud<T, HttpListResult<T>>>({
  featureName,
  dataServiceType,
}: {
  featureName: string;
  dataServiceType: Type<S>;
}) {
  return signalStoreFeature(
    withDevtools(featureName),
    withImmutableState(initialState<T>()),
    withEntities<T>(),
    withProps(() => ({
      _apiService: inject(dataServiceType),
      _storeNotificationService: inject(notificationStore),
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
                    showNotification(
                      'ERROR',
                      (error as Error | HttpErrorResponse).message ?? `${featureName}.list.error`
                    );
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
                    showNotification(
                      'ERROR',
                      (error as Error | HttpErrorResponse).message ?? `${featureName}.getOne.error`
                    );
                  },
                })
              );
            })
          )
        ),

        create: rxMethod<Partial<T>>(
          pipe(
            switchMap(data => {
              updateState(store, `[${featureName}] create`);
              return store._apiService.create(data).pipe(
                tapResponse<T>({
                  next: createdItem => {
                    updateState(
                      store,
                      `[${featureName}] create success`,
                      addEntity(createdItem, {
                        selectId: entity => entity.id || '',
                      }),
                      {
                        count: store.count() + 1,
                      }
                    );
                    showNotification('SUCCESS', `${featureName}.create.success`);
                  },
                  error: error => {
                    updateState(store, `[${featureName}] create error`);
                    showNotification(
                      'ERROR',
                      (error as Error | HttpErrorResponse).message ?? `${featureName}.create.error`
                    );
                  },
                })
              );
            })
          )
        ),

        update: rxMethod<{ id: IdType<T>; data: Partial<T> }>(
          pipe(
            switchMap(({ id, data }) => {
              updateState(store, `[${featureName}] update`);
              return store._apiService.update(id, data).pipe(
                tapResponse<T | void>({
                  next: updatedItem => {
                    if (updatedItem) {
                      updateState(
                        store,
                        `[${featureName}] update success`,
                        updateEntity({
                          id: updatedItem.id || (id as string),
                          changes: updatedItem,
                        })
                      );
                    }
                    showNotification('SUCCESS', `${featureName}.update.success`);
                  },
                  error: error => {
                    updateState(store, `[${featureName}] update error`);
                    showNotification(
                      'ERROR',
                      (error as Error | HttpErrorResponse).message ?? `${featureName}.update.error`
                    );
                  },
                })
              );
            })
          )
        ),

        delete: rxMethod<IdType<T>>(
          pipe(
            switchMap(id => {
              updateState(store, `[${featureName}] delete`);
              return store._apiService.delete(id).pipe(
                tapResponse<unknown>({
                  next: () => {
                    updateState(
                      store,
                      `[${featureName}] delete success`,
                      removeEntity(id as IdType<T>),
                      {
                        count: Math.max(0, store.count() - 1),
                        selectedItemId:
                          store.selectedItemId() === id ? null : store.selectedItemId(),
                      }
                    );
                    showNotification('SUCCESS', `${featureName}.delete.success`);
                  },
                  error: error => {
                    updateState(store, `[${featureName}] delete error`);
                    showNotification(
                      'ERROR',
                      (error as Error | HttpErrorResponse).message ?? `${featureName}.delete.error`
                    );
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
