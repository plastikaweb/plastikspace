import { createFeature, createReducer, on } from '@ngrx/store';

import { Notification } from '@plastik/shared/notification/entities';
import { notificationActions } from './notification.actions';

const NOTIFICATION_FEATURE_KEY = 'notification';

export interface State {
  configuration: Notification | null;
  preserveOnRouteRequest: boolean;
}

export const initialState: State = {
  configuration: null,
  preserveOnRouteRequest: true,
};

export interface NotificationPartialState {
  readonly [NOTIFICATION_FEATURE_KEY]: State;
}

const notificationReducer = createReducer(
  initialState,
  on(
    notificationActions.show,
    (state, { configuration, preserve }): State => ({
      ...state,
      configuration,
      preserveOnRouteRequest: preserve ?? true,
    })
  ),
  on(
    notificationActions.dismiss,
    (state): State => ({ ...state, configuration: null, preserveOnRouteRequest: true })
  )
);

export const selectNotificationFeature = createFeature({
  name: NOTIFICATION_FEATURE_KEY,
  reducer: notificationReducer,
});

export const { name, reducer, selectConfiguration, selectPreserveOnRouteRequest } =
  selectNotificationFeature;
