/**
 * The semantic type of an alert banner.
 * Maps to the four notification states used across the design system.
 */
export type AlertType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export const ALERT_ICONS: Record<AlertType, string> = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'check_circle',
  ERROR: 'error',
};
