import { createFeatureSelector, createSelector } from '@ngrx/store';

import { NOTIFICATION_FEATURE_KEY, State } from './notification.reducer';

export const selectNotificationState = createFeatureSelector<State>(NOTIFICATION_FEATURE_KEY);

export const selectNotificationConfiguration = createSelector(selectNotificationState, (state: State) => state.configuration);

export const selectNotificationPreserveOnRouteRequest = createSelector(
  selectNotificationState,
  (state: State) => state.preserveOnRouteRequest,
);
