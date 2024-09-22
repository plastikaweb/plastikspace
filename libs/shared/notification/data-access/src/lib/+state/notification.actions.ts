import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Notification } from '@plastik/shared/notification/entities';

export const notificationActions = createActionGroup({
  source: 'Notification',
  events: {
    Show: props<{ configuration: Notification; preserve?: boolean }>(),
    Dismiss: emptyProps(),
  },
});
