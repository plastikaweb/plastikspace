import { InjectionToken } from '@angular/core';
import { NotificationType, NotificationTypesConfig } from '@plastik/core/notification/entities';

export const defaultNotification: NotificationTypesConfig = {
  [NotificationType.Error]: {
    type: NotificationType.Error,
    icon: 'cancel',
    action: 'close',
  },
  [NotificationType.Warning]: {
    type: NotificationType.Warning,
    icon: 'warning',
    duration: 5000,
  },
  [NotificationType.Info]: {
    type: NotificationType.Info,
    icon: 'info',
    duration: 5000,
  },
  [NotificationType.Success]: {
    type: NotificationType.Success,
    icon: 'check',
    duration: 3000,
  },
};

export const NOTIFICATION_TYPES_CONFIG = new InjectionToken<NotificationTypesConfig>('notification', {
  providedIn: 'root',
  factory: () => defaultNotification,
});
