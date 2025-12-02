import { Type } from '@angular/core';
import { signalStoreFeature, SignalStoreFeature, withHooks } from '@ngrx/signals';
import { DataGet } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/eco-store/entities';
import { ListResult } from 'pocketbase';
import { PocketBaseListParams } from '../pocketbase-store.types';
import { withPocketBaseGetOneFeature, withPocketBaseListFeature } from '../pocketbase.features';

/**
 * Store feature for list + single item operations with PocketBase.
 * Use this when you need to display a list and view individual item details.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @returns {SignalStoreFeature} A signal store feature with list and single item operations.
 */
export function withPocketBaseGet<
  T extends BasePocketBaseEntity,
  S extends DataGet<T, ListResult<T>, PocketBaseListParams>,
>({ featureName, dataServiceType }: { featureName: string; dataServiceType: Type<S> }) {
  return signalStoreFeature(
    withPocketBaseListFeature<T, S>({ featureName, dataServiceType }),
    withPocketBaseGetOneFeature<T, S>({ featureName }),
    withHooks({
      onInit: store => {
        store.getList();
      },
    })
  );
}
