import { InjectionToken } from '@angular/core';

/**
 * Injection token for the default category icon.
 * Used when displaying "All Products" or when no category is selected.
 */
export const ALL_PRODUCTS_ICON = new InjectionToken<string>('ALL_PRODUCTS_ICON', {
  providedIn: 'root',
  factory: () => 'storefront',
});
