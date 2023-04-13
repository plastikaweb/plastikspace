export enum NotificationType {
  Error = 'ERROR',
  Warning = 'WARNING',
  Info = 'INFO',
  Success = 'SUCCESS',
}

/**
 * Configuration for a snackBar notification box.
 */
export interface Notification {
  /**
   * The main text of the notification.
   */
  message: string;
  /**
   * The type of notification: Error | Info | Success | Warning.
   */
  type: NotificationType;
  /**
   * Sets an optional path to a material svg icon.
   */
  icon?: string;
  /**
   * Sets a text for the dismiss box action.
   * If not provided, the button does not appear in the box.
   */
  action?: string;
  /**
   * Sets the duration of the visibility of the notification in the UI.
   */
  duration?: number;
}

export type NotificationTypesConfig = Record<NotificationType, Partial<Notification>>;
