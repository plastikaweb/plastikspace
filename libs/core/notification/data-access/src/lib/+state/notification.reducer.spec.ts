import { Action } from '@ngrx/store';

import { Notification } from '@plastik/core/notification/entities';
import { dismissNotification, showNotification } from './notification.actions';
import { State, initialState, notificationReducer } from './notification.reducer';

describe('Notification Reducer', () => {
  describe('valid Notification actions', () => {
    it('showNotification should return the message configuration', () => {
      const configuration: Notification = { type: 'ERROR', message: 'OK' };
      const action = showNotification({ configuration, preserve: true });

      const result: State = notificationReducer(initialState, action);

      expect(result.configuration).toEqual(configuration);
      expect(result.preserveOnRouteRequest).toBeTruthy();
    });

    it('dismissNotification should return a message configuration with the value of null', () => {
      const action = dismissNotification();

      const result: State = notificationReducer(initialState, action);

      expect(result.configuration).toBeNull();
      expect(result.preserveOnRouteRequest).toBeFalsy();
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = notificationReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
