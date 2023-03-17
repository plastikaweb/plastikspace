import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ACTIVITY_FEATURE_KEY, State } from './activity.reducer';

export const selectActivityState = createFeatureSelector<State>(ACTIVITY_FEATURE_KEY);

export const selectActivityActive = createSelector(selectActivityState, (state: State) => state.active);
