import { NotificationType } from '@plastik/core/notification/entities';
import { NotificationPartialState, initialState } from './notification.reducer';
import { selectNotificationConfiguration, selectNotificationPreserveOnRouteRequest } from './notification.selectors';

describe('Notification Selectors', () => {
  let state: NotificationPartialState;

  beforeEach(() => {
    state = {
      notification: {
        ...initialState,
        configuration: { type: NotificationType.Error, message: 'ERROR' },
        preserveOnRouteRequest: true,
      },
    };
  });

  it('selectNotificationConfiguration should return the Notification configuration', () => {
    const results = selectNotificationConfiguration(state);

    expect(results).toEqual({ type: NotificationType.Error, message: 'ERROR' });
  });

  it('selectNotificationPreserveOnRouteRequest should return the NotificationPreserveOnRouteRequest value', () => {
    const results = selectNotificationPreserveOnRouteRequest(state);

    expect(results).toBeTruthy();
  });
});
