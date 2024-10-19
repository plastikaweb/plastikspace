import { InjectionToken } from '@angular/core';
import { NotificationTypesConfig } from './notification';

export const defaultNotification: NotificationTypesConfig = {
  ['ERROR']: {
    type: 'ERROR',
    icon: 'cancel',
    action: 'close',
    ariaLabel: 'Close error notification',
    duration: undefined,
  },
  ['WARNING']: {
    type: 'WARNING',
    icon: 'warning',
    duration: 5000,
  },
  ['INFO']: {
    type: 'INFO',
    icon: 'info',
    duration: 5000,
  },
  ['SUCCESS']: {
    type: 'SUCCESS',
    icon: 'check',
    duration: 5000,
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
