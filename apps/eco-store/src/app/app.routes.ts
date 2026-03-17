import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'accedir',
    data: { bodyScrollable: true },
    loadChildren: () =>
      import('@plastik/eco-store/auth/login').then(m => m.ecoStoreAuthLoginRoutes),
  },
  {
    path: '',
    loadChildren: () => import('@plastik/eco-store/layout').then(m => m.layoutRoutes),
  },
];
