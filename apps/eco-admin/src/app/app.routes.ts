import { Route } from '@angular/router';
import { ecoAdminSessionGuard } from '@plastik/eco-admin/auth/data-access';
import { ecoAdminTenantContextGuard } from '@plastik/eco-admin/tenant-context';

/**
 * Routes of this stage of AP-0 0.7: the login screen, the three screens that set a new password and
 * one provisional page behind the session.
 *
 * The paths of the auth screens are the storefront's: the shared facades and notices navigate to
 * them by name (`/accedir`, `/recuperar-contrasenya`, `/recuperar-contrasenya-enviada`).
 *
 * The application shell replaces the empty path with its own route table. Until then the homes
 * the login navigates to (`/tauler`, `/cooperatives`) fall through the wildcard to that page.
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
