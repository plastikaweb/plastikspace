import type { EcoEntitiesPlaceholder } from '@plastik/eco/entities';

/**
 * Placeholder for the admin tenant-context store (AREF-03): auth-derived for a
 * tenant admin, selector-driven for a global admin. Typed against
 * `@plastik/eco/entities` so the `scope:eco-admin` to `scope:eco` boundary is
 * exercised from the first commit.
 */
export type EcoAdminTenantContextPlaceholder = EcoEntitiesPlaceholder;
