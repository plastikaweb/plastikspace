import { TestBed } from '@angular/core/testing';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { mockEcoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context/testing';

import { ECO_ADMIN_PLATFORM_NAV, ECO_ADMIN_TENANT_NAV } from './eco-admin-nav';
import { EcoAdminNavigation } from './eco-admin-navigation';

describe('EcoAdminNavigation', () => {
  let navigation: EcoAdminNavigation;

  const paths = (): string[] => navigation.items().map(entry => entry.path);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore },
      ],
    });
    navigation = TestBed.inject(EcoAdminNavigation);
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(false);
    mockEcoAdminTenantContextStore.hasCyclesSection.set(true);
  });

  it('gives a tenant administrator the ten entries of the rail, in the frozen order', () => {
    expect(navigation.variant()).toBe('tenant');
    expect(paths()).toEqual([
      'tauler',
      'sol-licituds',
      'socis',
      'comandes',
      'lliuraments',
      'cicles',
      'productes',
      'categories',
      'botiga',
      'estadistiques',
    ]);
  });

  it('leaves Cicles out while the tenant has no cycles section', () => {
    mockEcoAdminTenantContextStore.hasCyclesSection.set(false);

    expect(paths()).not.toContain('cicles');
    expect(paths()).toHaveLength(ECO_ADMIN_TENANT_NAV.length - 1);
  });

  it('gives a global administrator the platform rail, whatever the tenant context says', () => {
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(true);
    mockEcoAdminTenantContextStore.hasCyclesSection.set(false);

    expect(navigation.variant()).toBe('platform');
    expect(navigation.items()).toBe(ECO_ADMIN_PLATFORM_NAV);
  });

  it('labels every entry with a key under shell.nav', () => {
    for (const entry of [...ECO_ADMIN_TENANT_NAV, ...ECO_ADMIN_PLATFORM_NAV]) {
      expect(entry.labelKey).toMatch(/^shell\.nav\.[a-zA-Z]+$/);
    }
  });
});
