import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Notification } from '@plastik/core/notification/entities';

export const notificationActions = createActionGroup({
  source: 'Notification',
  events: {
    Show: props<{ configuration: Notification; preserve?: boolean }>(),
    Dismiss: emptyProps(),
  },
});
