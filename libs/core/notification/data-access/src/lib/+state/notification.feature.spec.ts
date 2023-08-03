import { Action } from '@ngrx/store';

import { Notification } from '@plastik/core/notification/entities';
import { notificationActions } from './notification.actions';
import {
  NotificationPartialState,
  State,
  initialState,
  reducer,
  selectConfiguration,
  selectPreserveOnRouteRequest,
} from './notification.feature';

describe('Notification Reducer', () => {
  describe('valid Notification actions', () => {
    it('showNotification should return the message configuration', () => {
      const configuration: Notification = { type: 'ERROR', message: 'OK' };
      const action = notificationActions.show({ configuration, preserve: true });

      const result: State = reducer(initialState, action);

      expect(result.configuration).toEqual(configuration);
      expect(result.preserveOnRouteRequest).toBeTruthy();
    });

    it('dismissNotification should return a message configuration with the value of null', () => {
      const action = notificationActions.dismiss();

      const result: State = reducer(initialState, action);

      expect(result.configuration).toBeNull();
      expect(result.preserveOnRouteRequest).toBeFalsy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});

describe('Notification Selectors', () => {
  let state: NotificationPartialState;

  beforeEach(() => {
    state = {
      notification: {
        ...initialState,
        configuration: { type: 'ERROR', message: 'ERROR' },
        preserveOnRouteRequest: true,
      },
    };
  });

  it('selectNotificationConfiguration should return the Notification configuration', () => {
    const results = selectConfiguration(state);

    expect(results).toEqual({ type: 'ERROR', message: 'ERROR' });
  });

  it('selectNotificationPreserveOnRouteRequest should return the NotificationPreserveOnRouteRequest value', () => {
    const results = selectPreserveOnRouteRequest(state);

    expect(results).toBeTruthy();
  });
});
