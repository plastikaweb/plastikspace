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
      const showNotification = (type: 'SUCCESS' | 'ERROR', message: string): void => {
        store._storeNotificationService.show({
          type,
          message,
          action: 'notification.close-short',
          duration: 5000,
        });
      };

      return {
        /**
         * @description Create a new record in PocketBase and update the local entity store.
         * @param {Partial<T>} data - The record data.
         * @param {RecordOptions} options - Optional PocketBase record options.
         * @returns {Promise<T>} The created record.
         */
        async create(data: Partial<T>, options?: RecordOptions): Promise<T> {
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
            showNotification('SUCCESS', `${featureName}.create.success`);
            return createdItem;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.create.error`;
            showNotification('ERROR', message);
            throw error;
          }
        },

        /**
         * @description Update an existing record in PocketBase and update the local entity store.
         * @param {IdType<T>} id - The record ID.
         * @param {Partial<T>} data - The record data.
         * @param {RecordOptions} options - Optional PocketBase record options.
         * @returns {Promise<T>} The updated record.
         */
        async update(id: IdType<T>, data: Partial<T>, options?: RecordOptions): Promise<T> {
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
            showNotification('SUCCESS', `${featureName}.update.success`);
            return updatedItem as T;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.update.error`;
            showNotification('ERROR', message);
            throw error;
          }
        },

        /**
         * @description Delete a record from PocketBase and remove it from the local entity store.
         * @param {IdType<T>} id - The record ID.
         * @returns {Promise<boolean>} True if the record was deleted successfully.
         */
        async delete(id: IdType<T>): Promise<boolean> {
          updateState(store, `[${featureName}] delete`);
          try {
            await firstValueFrom(store._apiService.delete(id));
            updateState(store, `[${featureName}] delete success`, removeEntity(id), {
              count: Math.max(0, store.count() - 1),
              selectedItemId: store.selectedItemId() === id ? null : store.selectedItemId(),
            });
            showNotification('SUCCESS', `${featureName}.delete.success`);
            return true;
          } catch (error) {
            const message = (error as ClientResponseError).message ?? `${featureName}.delete.error`;
            showNotification('ERROR', message);
            throw error;
          }
        },
      };
    })
  );
}
