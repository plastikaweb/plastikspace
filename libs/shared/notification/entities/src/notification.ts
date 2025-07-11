import { AriaLivePoliteness } from '@angular/cdk/a11y';

/**
 * The type of notification.
 */
export type NotificationType = 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';

/**
 * Configuration for a snackBar notification box.
 */
export interface Notification {
  /**
   * The main text of the notification.
   */
  message: string | undefined;
  /**
   * The type of notification: Error | Info | Success | Warning.
   */
  type: NotificationType;

  code?: string;

  name?: string;
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
   * Sets a ARIA label for the dismiss box action.
   * Is it provided only if action is defined.
   */
  ariaLabel?: string;
  /**
   * Sets the duration of the visibility of the notification in the UI.
   */
  duration?: number;

  /**
   * Any css classes to add to the HTML container that contains the notification.
   */
  containerClass?: string;

  /**
   * Screen y basis position of the notification.
   */
  verticalPosition?: 'top' | 'bottom';

  /**
   * Screen x basis position of the notification.
   */
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';

  politeness?: AriaLivePoliteness;
}

/**
 * Configuration for notification types with Notification types as Record Type properties.
 */
export type NotificationTypesConfig = Record<NotificationType, Partial<Notification>>;
