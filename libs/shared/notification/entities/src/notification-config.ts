import { InjectionToken } from '@angular/core';

import { Notification, NotificationTypesConfig } from './notification';

export const defaultNotification: NotificationTypesConfig = {
  ['ERROR']: {
    type: 'ERROR',
    icon: 'error',
    action: 'close',
    duration: 5000,
  },
  ['WARNING']: {
    type: 'WARNING',
    icon: 'warning',
    duration: 5000,
  },
  ['INFO']: {
    type: 'INFO',
    icon: 'info',
    duration: 3000,
  },
  ['SUCCESS']: {
    type: 'SUCCESS',
    icon: 'check',
    action: 'close',
    duration: 2000,
  },
};

/** Injection token with notification configuration dictionary depending on its type. */
export const NOTIFICATION_TYPES_CONFIG = new InjectionToken<NotificationTypesConfig>(
  'notification',
  {
    providedIn: 'root',
    factory: () => defaultNotification,
  }
);

/** Injection token with notification position. */
export const NOTIFICATION_POSITION = new InjectionToken<{
  verticalPosition: Notification['verticalPosition'];
  horizontalPosition: Notification['horizontalPosition'];
}>('notificationPosition');
