import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'category',
    loadChildren: () =>
      import('@plastik/llecoop/category').then(routes => routes.llecoopCategoryFeatureRoutes),
  },
];
