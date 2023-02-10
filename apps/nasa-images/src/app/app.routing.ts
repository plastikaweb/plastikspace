import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  { path: 'search', loadChildren: () => import('@plastik/nasa-images/search').then(routes => routes.nasaImagesFeatureSearchRoutes) },
];
