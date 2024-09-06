import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'category',
    loadChildren: () =>
      import('@plastik/llecoop/category/list').then(routes => routes.llecoopCategoryFeatureRoutes),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('@plastik/llecoop/product/list').then(
        routes => routes.llecoopProductFeatureListRoutes
      ),
  },
];
