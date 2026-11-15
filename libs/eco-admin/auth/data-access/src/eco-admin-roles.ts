import { PocketBaseUserRoles } from '@plastik/core/entities';

/**
 * The roles that may open a session in eco-admin. A storefront member (`PARTNER`) is not one of them.
 */
export const ECO_ADMIN_ALLOWED_ROLES = [
  'TENANT_ADMIN',
  'GLOBAL_ADMIN',
] as const satisfies readonly PocketBaseUserRoles[];

export type EcoAdminRole = (typeof ECO_ADMIN_ALLOWED_ROLES)[number];

/**
 * The route of the login screen.
 */
export const ECO_ADMIN_LOGIN_URL = '/accedir';

const ECO_ADMIN_HOME: Record<EcoAdminRole, string> = {
  TENANT_ADMIN: '/tauler',
  GLOBAL_ADMIN: '/cooperatives',
};

/**
 * Tells whether a role may use eco-admin.
 * @param {PocketBaseUserRoles | null | undefined} role The role on the user record, if any.
 * @returns {boolean} True for a tenant or a global administrator.
 */
export function isEcoAdminRole(role: PocketBaseUserRoles | null | undefined): role is EcoAdminRole {
  return !!role && (ECO_ADMIN_ALLOWED_ROLES as readonly PocketBaseUserRoles[]).includes(role);
}

/**
 * Gives the first screen of an administrator.
 * @param {EcoAdminRole} role The administrator's role.
 * @returns {string} The absolute path of their home.
 */
export function ecoAdminHomeFor(role: EcoAdminRole): string {
  return ECO_ADMIN_HOME[role];
}
