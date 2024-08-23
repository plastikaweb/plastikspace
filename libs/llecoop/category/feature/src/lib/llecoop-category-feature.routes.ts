import { Route } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { LlecoopCategoryFeatureComponent } from './llecoop-category-feature.component';

export const llecoopCategoryFeatureRoutes: Route[] = [
  {
    path: '',
    title: 'Categories de productes',
    component: LlecoopCategoryFeatureComponent,
    providers: [LlecoopCategoryStore],
  },
];
