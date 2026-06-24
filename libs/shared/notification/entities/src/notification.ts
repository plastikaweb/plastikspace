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
   * Screen y basis position of the notification. Values mirror Angular Material's
   * `MatSnackBarVerticalPosition` and are mapped to a hot-toast position by the hot-toast UI, so
   * every value must stay valid for both UIs.
   */
  verticalPosition?: 'top' | 'bottom';

  /**
   * Screen x basis position of the notification. Values mirror Angular Material's
   * `MatSnackBarHorizontalPosition` and are mapped to a hot-toast position by the hot-toast UI
   * (`start`/`left` → left, `end`/`right` → right, otherwise center), so every value must stay
   * valid for both UIs.
   */
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';

  politeness?: AriaLivePoliteness;
  /**
   * The parameters to pass to the translation.
   */
  parameters?: Record<string, unknown>;
  /**
   * An image content.
   */
  image?: string;
  /**
   * Caller-supplied deduplication identity. Notifications sharing a `groupKey`
   * replace one another in place instead of stacking (e.g. all cart events for a
   * given product share `cart:<productId>`).
   */
  groupKey?: string;
  /**
   * Store-assigned identifier used for UI tracking and per-item dismissal. The store generates a
   * fresh value whenever a notification is shown or moved to the top of the stack, while `groupKey`
   * (not this) is what collapses duplicates. Callers must not set this; the notification store owns it.
   */
  id?: string;
}

/**
 * Configuration for notification types with Notification types as Record Type properties.
 */
export type NotificationTypesConfig = Record<NotificationType, Partial<Notification>>;
