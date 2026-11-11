import { ECO_ADMIN_ALLOWED_ROLES, ecoAdminHomeFor, isEcoAdminRole } from './eco-admin-roles';

describe('eco-admin roles', () => {
  it('admits the two administrator roles and nobody else', () => {
    expect([...ECO_ADMIN_ALLOWED_ROLES]).toEqual(['TENANT_ADMIN', 'GLOBAL_ADMIN']);
    expect(isEcoAdminRole('TENANT_ADMIN')).toBe(true);
    expect(isEcoAdminRole('GLOBAL_ADMIN')).toBe(true);
    expect(isEcoAdminRole('PARTNER')).toBe(false);
    expect(isEcoAdminRole(undefined)).toBe(false);
    expect(isEcoAdminRole(null)).toBe(false);
  });

  it('sends each administrator to their own home', () => {
    expect(ecoAdminHomeFor('TENANT_ADMIN')).toBe('/tauler');
    expect(ecoAdminHomeFor('GLOBAL_ADMIN')).toBe('/cooperatives');
  });
});
