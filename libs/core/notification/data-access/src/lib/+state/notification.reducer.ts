import { Action, createReducer, on } from '@ngrx/store';

import { Notification } from '@plastik/core/notification/entities';
import { hideNotification, showNotification } from './notification.actions';

export const NOTIFICATION_FEATURE_KEY = 'notification';

export interface State {
  configuration: Notification | null;
  preserveOnRouteRequest: boolean;
}

export interface NotificationPartialState {
  readonly [NOTIFICATION_FEATURE_KEY]: State;
}

export const initialState: State = {
  configuration: null,
  preserveOnRouteRequest: false,
};

const reducer = createReducer(
  initialState,
  on(
    showNotification,
    (state, { configuration, preserve }): State => ({ ...state, configuration, preserveOnRouteRequest: preserve || false }),
  ),
  on(hideNotification, (state): State => ({ ...state, configuration: null, preserveOnRouteRequest: false })),
);

// eslint-disable-next-line jsdoc/require-jsdoc
export function notificationReducer(state: State | undefined, action: Action) {
  return reducer(state, action);
}
