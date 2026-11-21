import { inject } from '@angular/core';
import { RedirectFunction, Route } from '@angular/router';
import {
  pocketBaseRoleGuard,
  pocketBaseUserProfileStore,
} from '@plastik/auth/pocketbase/data-access';
import { PocketBaseUserRoles } from '@plastik/core/entities';
import {
  ECO_ADMIN_LOGIN_URL,
  ecoAdminHomeFor,
  ecoAdminSessionGuard,
  isEcoAdminRole,
} from '@plastik/eco-admin/auth/data-access';
import {
  ECO_ADMIN_PLATFORM_NAV,
  ECO_ADMIN_TENANT_NAV,
  EcoAdminNavItem,
} from '@plastik/eco-admin/layout-config';
import { ecoAdminTenantContextGuard } from '@plastik/eco-admin/tenant-context';

/**
 * The empty path and any unknown one send each administrator to their home.
 * A tenant's is the dashboard and the platform's the cooperatives. Redirects run before guards, so
 * someone with no session goes straight to the login screen.
 * @returns {string} The home of the signed-in role, or the login screen.
 */
const toRoleHome: RedirectFunction = () => {
  const role = inject(pocketBaseUserProfileStore).user()?.role;

  return isEcoAdminRole(role) ? ecoAdminHomeFor(role) : ECO_ADMIN_LOGIN_URL;
};

/**
 * One route per entry of a rail, behind the role the rail belongs to.
 * All load the provisional view until their own lands; the other role is sent back to its home.
 *
 * The role guard sits on each section, not on a parent: Angular reuses a parent while moving
 * between its children and would not ask its `canActivate` again, and a parent's
 * `canActivateChild` would outrank the shell's session guard and drop the `returnUrl` of a session
 * that expired. A section's own `canActivate` runs on every visit, after the shell's guards.
 * @param {readonly EcoAdminNavItem[]} entries The entries of the rail.
 * @param {PocketBaseUserRoles} role The role that may open them.
 * @returns {Route[]} One route per entry.
 */
function sectionRoutes(entries: readonly EcoAdminNavItem[], role: PocketBaseUserRoles): Route[] {
  const roleGuard = pocketBaseRoleGuard([role], { loginUrl: ECO_ADMIN_LOGIN_URL });

  return entries.map(entry => ({
    path: entry.path,
    title: entry.labelKey,
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./provisional-view/eco-admin-provisional-view.component').then(
        m => m.EcoAdminProvisionalViewComponent
      ),
  }));
}

/**
 * Routes of AP-0 0.7: the login screen, the three screens that set a new password, and the
 * application shell with one route per entry of its side navigation.
 *
 * The paths of the auth screens are the storefront's: the shared facades and notices navigate to
 * them by name (`/accedir`, `/recuperar-contrasenya`, `/recuperar-contrasenya-enviada`).
 */
export const appRoutes: Route[] = [
  {
    path: 'accedir',
    loadChildren: () =>
      import('@plastik/eco-admin/auth/login').then(m => m.ecoAdminAuthLoginRoutes),
  },
  {
    path: 'recuperar-contrasenya',
    loadChildren: () =>
      import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthForgotPasswordRoutes),
  },
  {
    path: 'recuperar-contrasenya-enviada',
    loadChildren: () =>
      import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthForgotPasswordSentRoutes),
  },
  {
    path: 'restablir-contrasenya',
    loadChildren: () =>
      import('@plastik/eco-admin/auth/recovery').then(m => m.ecoAdminAuthResetPasswordRoutes),
  },
  { path: '', pathMatch: 'full', redirectTo: toRoleHome },
  {
    path: '',
    // Also on the children: moving between sections reuses this route, so its `canActivate` would
    // not see a session that expired, or retry a tenant that failed to load, until a reload.
    canActivate: [ecoAdminSessionGuard, ecoAdminTenantContextGuard],
    canActivateChild: [ecoAdminSessionGuard, ecoAdminTenantContextGuard],
    loadComponent: () => import('@plastik/eco-admin/layout').then(m => m.EcoAdminLayoutComponent),
    children: [
      ...sectionRoutes(ECO_ADMIN_TENANT_NAV, 'TENANT_ADMIN'),
      ...sectionRoutes(ECO_ADMIN_PLATFORM_NAV, 'GLOBAL_ADMIN'),
    ],
  },
  // Not `redirectTo: ''`: Angular applies one relative redirect per level, so the empty path could
  // not then send on to the role's home.
  { path: '**', redirectTo: toRoleHome },
];
