import { withDevtools, withDevToolsStub } from '@angular-architects/ngrx-toolkit';
import { isDevMode, Type } from '@angular/core';
import { signalStoreFeature, SignalStoreFeature } from '@ngrx/signals';
import { DataGet } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ListResult } from 'pocketbase';
import { PocketBaseGetListState, PocketBaseListParams } from '../pocketbase-store.types';
import { withPocketBaseGetOneFeature, withPocketBaseListFeature } from '../pocketbase.features';

/**
 * Store feature for list + single item operations with PocketBase.
 * Use this when you need to display a list and view individual item details.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @param {Partial<PocketBaseGetListState>} root0.customInitialState - Optional custom initial state.
 * @param {boolean} root0.autoLoad - Whether to automatically load list on init (default: true).
 * @returns {SignalStoreFeature} A signal store feature with list and single item operations.
 */
export function withPocketBaseGet<
  T extends BasePocketBaseEntity,
  S extends DataGet<T, ListResult<T>, PocketBaseListParams>,
  STATE extends PocketBaseGetListState = PocketBaseGetListState,
>({
  featureName,
  dataServiceType,
  customInitialState,
  autoLoad = true,
}: {
  featureName: string;
  dataServiceType: Type<S>;
  customInitialState: Partial<STATE>;
  autoLoad?: boolean;
}) {
  return signalStoreFeature(
    isDevMode() ? withDevtools(featureName) : withDevToolsStub(featureName),
    withPocketBaseListFeature<T, S>({
      featureName,
      dataServiceType,
      customInitialState,
      autoLoad,
    }),

    withPocketBaseGetOneFeature<T, S>({ featureName })
  );
}
