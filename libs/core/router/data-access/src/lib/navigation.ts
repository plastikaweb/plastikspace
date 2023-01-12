import { NavigationExtras } from '@angular/router';

/**
 * URL params and extras container.
 */
export interface NavigationProps {
  path: string[];
  query?: Record<string, unknown>;
  extras?: NavigationExtras;
}
