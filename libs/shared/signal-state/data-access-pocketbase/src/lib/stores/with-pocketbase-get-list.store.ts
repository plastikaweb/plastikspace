import { isDevMode, Type } from '@angular/core';
import { withDevtools, withDevToolsStub } from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature, SignalStoreFeature } from '@ngrx/signals';
import { DataGetList } from '@plastik/core/api-base';
import { BasePocketBaseEntity } from '@plastik/core/entities';
import { ListResult } from 'pocketbase';
import { PocketBaseGetListState } from '../pocketbase-store.types';
import { withPocketBaseListFeature } from '../pocketbase.features';

/**
 * Store feature for read-only list operations with PocketBase.
 * Use this when you only need to display a list of items.
 * @template T - The entity type.
 * @template S - The service type.
 * @param {object} root0 - Configuration object.
 * @param {string} root0.featureName - The name of the feature for DevTools.
 * @param {Type<S>} root0.dataServiceType - The service type for data operations.
 * @param {Partial<PocketBaseGetListState>} root0.customInitialState - Optional custom initial state for the store.
 * @returns {SignalStoreFeature} A signal store feature with list operations.
 */
export function withPocketBaseGetList<
  T extends BasePocketBaseEntity,
  S extends DataGetList<T, ListResult<T>>,
>({
  featureName,
  dataServiceType,
  customInitialState = {},
}: {
  featureName: string;
  dataServiceType: Type<S>;
  customInitialState?: Partial<PocketBaseGetListState>;
}) {
  return signalStoreFeature(
    isDevMode() ? withDevtools(featureName) : withDevToolsStub(featureName),
    withPocketBaseListFeature<T, S>({ featureName, dataServiceType, customInitialState })
  );
}
