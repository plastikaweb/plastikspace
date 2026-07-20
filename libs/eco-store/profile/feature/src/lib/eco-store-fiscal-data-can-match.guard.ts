import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

/**
 * Matches the fiscal data section only when the tenant has fiscal capture enabled.
 * @returns {boolean} Whether the route may match.
 */
export const ecoStoreFiscalDataCanMatchGuard: CanMatchFn = () => {
  return !!inject(ecoStoreTenantStore).tenant()?.fiscalDataEnabled;
};
