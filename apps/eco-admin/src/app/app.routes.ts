import { Route } from '@angular/router';
import { ecoAdminAnonymousGuard, ecoAdminSessionGuard } from '@plastik/eco-admin/auth/data-access';
import { ecoAdminTenantContextGuard } from '@plastik/eco-admin/tenant-context';

/**
 * Routes of this stage of AP-0 0.7: the login screen and one provisional page behind the session.
 *
 * The application shell replaces the empty path with its own route table. Until then the homes
 * the login navigates to (`/tauler`, `/cooperatives`) fall through the wildcard to that page.
 */
export const appRoutes: Route[] = [
  {
    path: 'accedir',
    title: 'auth.login.title',
    canActivate: [ecoAdminAnonymousGuard],
    loadComponent: () =>
      import('@plastik/eco-admin/auth/login').then(m => m.EcoAdminAuthLoginComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'shell.placeholder.title',
    canActivate: [ecoAdminSessionGuard, ecoAdminTenantContextGuard],
    loadComponent: () =>
      import('./provisional-view/eco-admin-provisional-view.component').then(
        m => m.EcoAdminProvisionalViewComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
