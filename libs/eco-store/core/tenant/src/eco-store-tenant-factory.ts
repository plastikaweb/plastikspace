import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';
import { EcoStoreTenantService } from './eco-store-tenant.service';

/**
 * Factory function to provide the appropriate tenant service based on environment.
 * @returns {EcoStoreTenantBaseService} The tenant service implementation.
 */
function ecoStoreTenantFactory() {
  return new EcoStoreTenantService();
}

export const provideEcoStoreTenant = {
  provide: EcoStoreTenantBaseService,
  useFactory: ecoStoreTenantFactory,
};
