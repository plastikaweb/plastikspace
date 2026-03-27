import { updateState, withReset } from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature, SignalStoreFeature, withMethods } from '@ngrx/signals';
import { removeAllEntities } from '@ngrx/signals/entities';

/**
 * @description Store feature for resetting entities.
 * @param {string} featureName - The name of the feature for DevTools.
 * @param {object} partialState - Partial state to reset.
 * @returns {SignalStoreFeature} A signal store feature with reset functionality.
 */
export function withResetEntities(featureName = 'entities', partialState = {}) {
  return signalStoreFeature(
    withReset(),
    withMethods(store => ({
      reset(): void {
        store.resetState();
        updateState(store, `[${featureName}] reset`, state => ({
          ...state,
          ...partialState,
          ...removeAllEntities(),
        }));
      },
    }))
  );
}
