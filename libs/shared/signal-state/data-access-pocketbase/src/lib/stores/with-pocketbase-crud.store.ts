import { updateState, withDevtools, withDevToolsStub } from '@angular-architects/ngrx-toolkit';
import { isDevMode, Type } from '@angular/core';
import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { addEntity, removeEntity, updateEntity } from '@ngrx/signals/entities';
import { DataCrud } from '@plastik/core/api-base';
import { BasePocketBaseEntity, IdType } from '@plastik/core/entities';
import { ClientResponseError, ListResult, RecordOptions } from 'pocketbase';
import { firstValueFrom } from 'rxjs';
import { PocketBaseGetListState, PocketBaseListParams } from '../pocketbase-store.types';
import { withPocketBaseGetOneFeature, withPocketBaseListFeature } from '../pocketbase.features';

/**
 * @description Store feature for full CRUD operations with PocketBase. Use this when you need complete create, read, update, delete functionality.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @param {Partial<PocketBaseGetListState>} root0.customInitialState - Custom initial state for the store.
 * @returns {SignalStoreFeature} A signal store feature with CRUD operations.
 */
export function withPocketBaseCrud<
  T extends BasePocketBaseEntity,
  S extends DataCrud<T, ListResult<T>, PocketBaseListParams>,
>({
  featureName,
  dataServiceType,
  customInitialState,
}: {
  featureName: string;
  dataServiceType: Type<S>;
  customInitialState?: Partial<PocketBaseGetListState>;
}) {
  return signalStoreFeature(
    isDevMode() ? withDevtools(featureName) : withDevToolsStub(featureName),
    withPocketBaseListFeature<T, S>({
      featureName,
      dataServiceType,
      customInitialState,
    }),
    withPocketBaseGetOneFeature<T, S>({ featureName }),

    withMethods(store => {
      return {
        /**
         * @description Create a new record in PocketBase and update the local entity store.
         * @param {Partial<T>} data - The record data.
         * @param {RecordOptions} options - Optional PocketBase record options.
         * @param { {success: boolean, error: boolean } } showNotification - Whether to show notifications.
         * @returns {Promise<T>} The created record.
         */
        async create(
          data: Partial<T>,
          options?: RecordOptions,
          showNotification = { success: true, error: true }
        ): Promise<T | void> {
          updateState(store, `[${featureName}] create`);
          try {
            const createdItem = await firstValueFrom(store._apiService.create(data, options));
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
            if (showNotification.success) {
              store._notificationService.create(`${featureName}.create.success`, 'SUCCESS');
            }
            return createdItem;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.create.error`;
            if (showNotification.error) {
              store._notificationService.create(message, 'ERROR');
            }
          }
        },

        /**
         * @description Update an existing record in PocketBase and update the local entity store.
         * @param {IdType<T>} id - The record ID.
         * @param {Partial<T>} data - The record data.
         * @param {RecordOptions} options - Optional PocketBase record options.
         * @param { {success: boolean, error: boolean } } showNotification - Whether to show notifications.
         * @returns {Promise<T>} The updated record.
         */
        async update(
          id: IdType<T>,
          data: Partial<T>,
          options?: RecordOptions,
          showNotification = { success: true, error: true }
        ): Promise<T | void> {
          updateState(store, `[${featureName}] update`);
          try {
            const updatedItem = await firstValueFrom(store._apiService.update(id, data, options));
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
            if (showNotification.success) {
              store._notificationService.create(`${featureName}.update.success`, 'SUCCESS');
            }
            return updatedItem as T;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.update.error`;
            if (showNotification.error) {
              store._notificationService.create(message, 'ERROR');
            }
          }
        },

        /**
         * @description Delete a record from PocketBase and remove it from the local entity store.
         * @param {IdType<T>} id - The record ID.
         * @param { {success: boolean, error: boolean } } showNotification - Whether to show notifications.
         * @returns {Promise<boolean>} True if the record was deleted successfully.
         */
        async delete(
          id: IdType<T>,
          showNotification = { success: true, error: true }
        ): Promise<boolean> {
          updateState(store, `[${featureName}] delete`);
          try {
            await firstValueFrom(store._apiService.delete(id));
            updateState(store, `[${featureName}] delete success`, removeEntity(id), {
              count: Math.max(0, store.count() - 1),
              selectedItemId: store.selectedItemId() === id ? null : store.selectedItemId(),
            });
            if (showNotification.success) {
              store._notificationService.create(`${featureName}.delete.success`, 'SUCCESS');
            }
            return true;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.delete.error`;
            if (showNotification.error) {
              store._notificationService.create(message, 'ERROR');
            }
            return false;
          }
        },
      };
    })
  );
}
