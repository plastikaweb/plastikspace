import { signal } from '@angular/core';
import type { EcoStoreTenant } from '@plastik/eco/entities';
import type { EcoAdminTenantContextStatus } from './eco-admin-tenant-context.store';

export const mockEcoAdminTenantContextStore = {
  tenant: signal<EcoStoreTenant | null>(null),
  status: signal<EcoAdminTenantContextStatus>('idle'),
  hasCycles: signal<boolean | null>(null),
  tenantId: signal<string | null>(null),
  hasTenant: signal(false),
  tenantName: signal(''),
  isContinuous: signal(false),
  hasCyclesSection: signal(true),
  load: vi.fn().mockResolvedValue(undefined),
  reload: vi.fn().mockResolvedValue(undefined),
};
