import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'category',
    loadChildren: () => import('@plastik/llecoop/category').then(routes => routes.llecoopCategoryFeatureRoutes),
  },
];
