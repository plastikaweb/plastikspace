import { MatPaginatorIntl } from '@angular/material/paginator';
import { Routes } from '@angular/router';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';
import { isLoggedGuard } from './isLogged.guard';
import { isNotLoggedGuard } from './isNotLogged.guard';
import { LlecoopMatPaginatorIntl } from './mat-paginator-intl.service';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

// const redirectLoggedInAndVerifiedToHome = () => map((user: User) => {
//   return !user.uid || !user.emailVerified ? ['login'] : ['']
// });
// const redirectLoggedOutOrNoVerifiedToLogin = () => map((user: User) => {
//   console.log('user', user);
//   return user?.uid && user?.emailVerified ? [''] : ['login']
// });

export const appRoutes: Routes = [
  {
    path: 'login',
    title: 'Entrar a El Llevat',
    data: {
      title: 'Entrar a la botiga',
      logo: 'assets/img/favicon-32x32.png',
      label: 'Iniciar sessió',
      buttonStyle: 'w-full',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () => import('@plastik/auth/login').then(routes => routes.authLoginFeatureRoutes),
  },
  {
    path: 'registre',
    title: 'Registre de socis de El Llevat',
    data: {
      title: 'Registre de socis',
      logo: 'assets/img/favicon-32x32.png',
      label: 'Registrar-se',
      buttonStyle: 'w-full',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () =>
      import('@plastik/auth/register').then(routes => routes.authRegisterFeatureRoutes),
  },
  {
    path: 'admin',
    canActivate: [isLoggedGuard],
    loadComponent: () => CoreCmsLayoutFeatureComponent,
    providers: [
      {
        provide: MatPaginatorIntl,
        useClass: LlecoopMatPaginatorIntl,
      },
    ],
    children: [
      {
        path: 'categoria/crear',
        loadChildren: () =>
          import('@plastik/llecoop/category/detail').then(
            routes => routes.categoryFeatureDetailCreateRoutes
          ),
      },
      {
        path: 'categoria/:id',
        loadChildren: () =>
          import('@plastik/llecoop/category/detail').then(
            routes => routes.categoryFeatureDetailUpdateRoutes
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
            routes => routes.productFeatureDetailCreateRoutes
          ),
      },
      {
        path: 'producte/:id',
        loadChildren: () =>
          import('@plastik/llecoop/product/detail').then(
            routes => routes.productFeatureDetailUpdateRoutes
          ),
      },
      {
        path: 'producte',
        loadChildren: () =>
          import('@plastik/llecoop/product/list').then(
            routes => routes.llecoopProductFeatureListRoutes
          ),
      },
      {
        path: 'usuari',
        loadChildren: () =>
          import('@plastik/llecoop/user/list').then(routes => routes.llecoopUserFeatureListRoutes),
      },
      {
        path: 'usuari/crear',
        loadChildren: () =>
          import('@plastik/llecoop/user/create').then(
            routes => routes.llecoopUserFeatureCreateRoutes
          ),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'admin/producte',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'admin/producte',
  },
];
