import { computed, inject, Injectable } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';

import {
  ECO_ADMIN_PLATFORM_NAV,
  ECO_ADMIN_TENANT_NAV,
  EcoAdminNavItem,
  EcoAdminNavVariant,
} from './eco-admin-nav';

/**
 * The side navigation of the signed-in administrator: which rail they get and the entries in it.
 * Conditional on the role and on the tenant's state, which is why it is data access and not a constant.
 */
@Injectable({ providedIn: 'root' })
export class EcoAdminNavigation {
  readonly #profile = inject(pocketBaseUserProfileStore);
  readonly #tenantContext = inject(ecoAdminTenantContextStore);

  /** The platform's rail for a global administrator, the tenant's for everyone else. */
  readonly variant = computed<EcoAdminNavVariant>(() =>
    this.#profile.isGlobalAdmin() ? 'platform' : 'tenant'
  );

  /** The entries of that rail, without Cicles while the tenant has no cycles section. */
  readonly items = computed<readonly EcoAdminNavItem[]>(() => {
    if (this.variant() === 'platform') {
      return ECO_ADMIN_PLATFORM_NAV;
    }

    const hasCyclesSection = this.#tenantContext.hasCyclesSection();

    return ECO_ADMIN_TENANT_NAV.filter(navItem => !navItem.needsCyclesSection || hasCyclesSection);
  });
}
