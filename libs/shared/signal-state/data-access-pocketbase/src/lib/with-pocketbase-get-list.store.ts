import { Type } from '@angular/core';
import { signalStoreFeature, withHooks } from '@ngrx/signals';
import { DataGetList } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ListResult } from 'pocketbase';
import { PocketBaseListParams } from './pocketbase-store.types';
import { withPocketBaseListFeature } from './pocketbase.features';

/**
 * Store feature for read-only list operations with PocketBase.
 * Use this when you only need to display a list of items.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with list operations.
 */
export function withPocketBaseGetList<
  T extends BasePocketBaseEntity,
  S extends DataGetList<T, ListResult<T>, PocketBaseListParams>,
>({ featureName, dataServiceType }: { featureName: string; dataServiceType: Type<S> }) {
  return signalStoreFeature(
    withPocketBaseListFeature<T, S>({ featureName, dataServiceType }),
    withHooks({
      onInit: store => {
        store.getList();
      },
    })
  );
}
