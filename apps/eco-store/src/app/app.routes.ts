import { Route } from '@angular/router';
export const appRoutes: Route[] = [
  {
    path: 'accedir',
    loadChildren: () =>
      import('@plastik/eco-store/auth/login').then(m => m.ecoStoreAuthLoginRoutes),
  },
  {
    path: 'recuperar-contrasenya',
    loadChildren: () =>
      import('@plastik/eco-store/auth/forgot-password').then(
        m => m.ecoStoreAuthForgotPasswordRoutes
      ),
  },
  {
    path: 'recuperar-contrasenya-enviada',
    loadChildren: () =>
      import('@plastik/eco-store/auth/forgot-password-sent').then(
        m => m.ecoStoreAuthFeatureForgotPasswordSentRoutes
      ),
  },
  {
    path: 'restablir-contrasenya',
    loadChildren: () =>
      import('@plastik/eco-store/auth/reset-password').then(
        m => m.ecoStoreAuthFeatureResetPasswordRoutes
      ),
  },
  {
    path: 'confirmar-correu',
    loadChildren: () =>
      import('@plastik/eco-store/auth/confirm-email-change').then(
        m => m.ecoStoreAuthFeatureConfirmEmailChangeRoutes
      ),
  },
  {
    path: '',
    loadChildren: () => import('@plastik/eco-store/layout').then(m => m.layoutRoutes),
  },
];
