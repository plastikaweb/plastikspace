import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'search', loadChildren: () => import('@plastik/nasa-images/search').then(routes => routes.nasaImagesSearchFeatureRoutes) },
  { path: 'faqs', loadChildren: () => import('@plastik/nasa-images/faqs').then(routes => routes.nasaImagesFaqsFeatureRoutes) },
  { path: '**', redirectTo: 'search', pathMatch: 'full' },
];
