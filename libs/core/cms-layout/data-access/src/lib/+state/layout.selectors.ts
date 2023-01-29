import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LAYOUT_FEATURE_KEY, State } from './layout.reducer';

// Lookup the 'Layout' feature state managed by NgRx
export const selectLayoutState = createFeatureSelector<State>(LAYOUT_FEATURE_KEY);

export const selectIsMobile = createSelector(selectLayoutState, state => state.isMobile);
export const selectSidenavOpened = createSelector(selectLayoutState, state => state.sidenavOpened);
