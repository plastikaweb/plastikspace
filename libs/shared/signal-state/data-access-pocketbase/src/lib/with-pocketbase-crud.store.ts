import { updateState } from '@angular-architects/ngrx-toolkit';
import { Type } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { signalStoreFeature, withHooks, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DataCrud } from '@plastik/core/api-base';
import { IdType } from '@plastik/core/entities';
import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ClientResponseError, ListResult, RecordOptions } from 'pocketbase';
import { pipe, switchMap, tap } from 'rxjs';
import { PocketBaseListParams } from './pocketbase-store.types';
import { withPocketBaseGetOneFeature, withPocketBaseListFeature } from './pocketbase.features';

/**
 * Store feature for full CRUD operations with PocketBase.
 * Use this when you need complete create, read, update, delete functionality.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with CRUD operations.
 */
export function withPocketBaseCrud<
  T extends BasePocketBaseEntity,
  S extends DataCrud<T, ListResult<T>, PocketBaseListParams>,
>({ featureName, dataServiceType }: { featureName: string; dataServiceType: Type<S> }) {
  return signalStoreFeature(
    withPocketBaseListFeature<T, S>({ featureName, dataServiceType }),
    withPocketBaseGetOneFeature<T, S>({ featureName }),
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
        create: rxMethod<{ data: Partial<T>; options?: RecordOptions }>(
          pipe(
            tap(() => updateState(store, `[${featureName}] create`)),
            switchMap(({ data, options }) => {
              return store._apiService.create(data, options).pipe(
                tapResponse<T, ClientResponseError>({
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
                    showNotification('ERROR', error.message ?? `${featureName}.create.error`);
                  },
                })
              );
            })
          )
        ),

        update: rxMethod<{ id: IdType<T>; data: Partial<T>; options?: RecordOptions }>(
          pipe(
            tap(() => updateState(store, `[${featureName}] update`)),
            switchMap(({ id, data, options }) => {
              return store._apiService.update(id, data, options).pipe(
                tapResponse<T | void, ClientResponseError>({
                  next: updatedItem => {
                    if (updatedItem) {
                      updateState(
                        store,
                        `[${featureName}] update success`,
                        updateEntity({
                          id: updatedItem.id || id,
                          changes: updatedItem,
                        })
                      );
                    }
                    showNotification('SUCCESS', `${featureName}.update.success`);
                  },
                  error: error => {
                    showNotification('ERROR', error.message ?? `${featureName}.update.error`);
                  },
                })
              );
            })
          )
        ),

        delete: rxMethod<IdType<T>>(
          pipe(
            tap(() => updateState(store, `[${featureName}] delete`)),
            switchMap(id => {
              return store._apiService.delete(id).pipe(
                tapResponse<unknown, ClientResponseError>({
                  next: () => {
                    updateState(store, `[${featureName}] delete success`, removeEntity(id), {
                      count: Math.max(0, store.count() - 1),
                      selectedItemId: store.selectedItemId() === id ? null : store.selectedItemId(),
                    });
                    showNotification('SUCCESS', `${featureName}.delete.success`);
                  },
                  error: error => {
                    showNotification('ERROR', error.message ?? `${featureName}.delete.error`);
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
        store.getList();
      },
    })
  );
}
