import { Routes } from '@angular/router';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';
import { isLoggedGuard } from './isLogged.guard';
import { isNotLoggedGuard } from './isNotLogged.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    title: 'Autenticació',
    data: {
      title: 'El Llevat',
      logo: 'assets/img/favicon-32x32.png',
      label: 'Iniciar sessió',
      buttonStyle: 'w-full',
    },
    providers: [FirebaseAuthService],
    canActivate: [isNotLoggedGuard],
    loadChildren: () => import('@plastik/auth/login').then(routes => routes.authLoginFeatureRoutes),
  },
  {
    path: 'admin',
    canActivate: [isLoggedGuard],
    loadComponent: () => CoreCmsLayoutFeatureComponent,
    children: [
      {
        path: 'categoria/crear',
        loadChildren: () =>
          import('@plastik/llecoop/category/detail').then(
            routes => routes.categoryFeatureDetailRoutes
          ),
      },
      {
        path: 'categoria',
        loadChildren: () =>
          import('@plastik/llecoop/category/list').then(
            routes => routes.llecoopCategoryFeatureRoutes
          ),
      },
      {
        path: 'producte/crear',
        loadChildren: () =>
          import('@plastik/llecoop/product/detail').then(
            routes => routes.productFeatureDetailRoutes
          ),
      },
      {
        path: 'producte',
        loadChildren: () =>
          import('@plastik/llecoop/product/list').then(
            routes => routes.llecoopProductFeatureListRoutes
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'admin/producte',
    pathMatch: 'full',
  },
];
