import { inject } from '@angular/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreTenantService } from './eco-store-tenant.service';
import { EcoStoreTenantStagingService } from './eco-store-tenant-staging.service';
import { EcoStoreTenantBaseService } from './eco-store-tenant-base.service';

/**
 * Factory function to provide the appropriate tenant service based on environment.
 * @returns {EcoStoreTenantBaseService} The tenant service implementation.
 */
function ecoStoreTenantFactory() {
  const environment = inject(ENVIRONMENT);

  if (environment.environment === 'staging') {
    return new EcoStoreTenantStagingService();
  } else {
    return new EcoStoreTenantService();
  }
}

export const provideEcoStoreTenant = {
  provide: EcoStoreTenantBaseService,
  useFactory: ecoStoreTenantFactory,
};
