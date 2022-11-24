import { NavigationExtras } from '@angular/router';

export interface NavigationProps {
  path: string[];
  query?: Record<string, unknown>;
  extras?: NavigationExtras;
}
