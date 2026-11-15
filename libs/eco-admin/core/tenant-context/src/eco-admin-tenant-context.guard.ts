import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ecoAdminTenantContextStore } from './eco-admin-tenant-context.store';

/**
 * Holds a navigation until the tenant context is settled, then always lets it through.
 *
 * It waits; it never blocks. A failed load still activates the route, with the store's `status` at `error`, and
 * a global administrator passes at once because they have no tenant to load. Put it after the guard that
 * checks the session: without a session there is nothing to wait for.
 * @returns {Promise<boolean>} Always true, once the store is settled.
 */
export const ecoAdminTenantContextGuard: CanActivateFn = async () => {
  await inject(ecoAdminTenantContextStore).load();

  return true;
};
