import { inject } from '@angular/core';
import { RedirectFunction, Route } from '@angular/router';
import {
  pocketBaseRoleGuard,
  pocketBaseUserProfileStore,
} from '@plastik/auth/pocketbase/data-access';
import {
  ECO_ADMIN_LOGIN_URL,
  ecoAdminHomeFor,
  ecoAdminSessionGuard,
  isEcoAdminRole,
} from '@plastik/eco-admin/auth/data-access';
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
 * The role guards of the sections, one per rail; the other role is sent back to its home.
 *
 * Each sits on the section, not on a parent: Angular reuses a parent while moving between its
 * children and would not ask its `canActivate` again, and a parent's `canActivateChild` would
 * outrank the shell's session guard and drop the `returnUrl` of a session that expired. A
 * section's own `canActivate` runs on every visit, after the shell's guards.
 */
const ecoAdminTenantRoleGuard = pocketBaseRoleGuard(['TENANT_ADMIN'], {
  loginUrl: ECO_ADMIN_LOGIN_URL,
});
const ecoAdminPlatformRoleGuard = pocketBaseRoleGuard(['GLOBAL_ADMIN'], {
  loginUrl: ECO_ADMIN_LOGIN_URL,
});

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
    // One route per rail entry, in rail order, written out so tools/feature-map.cjs can read them;
    // app.routes.spec.ts fails when they drift from ECO_ADMIN_TENANT_NAV / ECO_ADMIN_PLATFORM_NAV.
    // All load the provisional view until their own lands.
    children: [
      {
        path: 'tauler',
        title: 'shell.nav.tauler',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'sol-licituds',
        title: 'shell.nav.solLicituds',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'socis',
        title: 'shell.nav.socis',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'comandes',
        title: 'shell.nav.comandes',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'lliuraments',
        title: 'shell.nav.lliuraments',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'cicles',
        title: 'shell.nav.cicles',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'productes',
        title: 'shell.nav.productes',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'categories',
        title: 'shell.nav.categories',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'botiga',
        title: 'shell.nav.botiga',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'estadistiques',
        title: 'shell.nav.estadistiques',
        canActivate: [ecoAdminTenantRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'cooperatives',
        title: 'shell.nav.cooperatives',
        canActivate: [ecoAdminPlatformRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'catalegs',
        title: 'shell.nav.catalegs',
        canActivate: [ecoAdminPlatformRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
      {
        path: 'idiomes',
        title: 'shell.nav.idiomes',
        canActivate: [ecoAdminPlatformRoleGuard],
        loadComponent: () =>
          import('./provisional-view/eco-admin-provisional-view.component').then(
            m => m.EcoAdminProvisionalViewComponent
          ),
      },
    ],
  },
  // Not `redirectTo: ''`: Angular applies one relative redirect per level, so the empty path could
  // not then send on to the role's home.
  { path: '**', redirectTo: toRoleHome },
];
