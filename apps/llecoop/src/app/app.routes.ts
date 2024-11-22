import { AuthGuard, hasCustomClaim } from '@angular/fire/auth-guard';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Routes } from '@angular/router';
import { isLoggedGuard, isNotLoggedGuard } from '@plastik/auth/firebase/data-access';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';
import { LlecoopMatPaginatorIntl } from './mat-paginator-intl.service';
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

// const redirectLoggedInAndVerifiedToHome = () => map((user: User) => {
//   return !user.uid || !user.emailVerified ? ['login'] : ['']
// });
// const redirectLoggedOutOrNoVerifiedToLogin = () => map((user: User) => {
//   console.log('user', user);
//   return user?.uid && user?.emailVerified ? [''] : ['login']
// });

const adminOnly = () => hasCustomClaim('isAdmin');

export const appRoutes: Routes = [
  {
    path: 'login',
    title: 'Entrar a El Llevat',
    data: {
      title: 'Entrar a la botiga',
      logo: 'assets/img/favicon-32x32.png',
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
    path: 'peticio-clau',
    title: 'Petició de clau nova',
    data: {
      title: 'Petició de clau nova',
      logo: 'assets/img/favicon-32x32.png',
      label: 'Enviar petició',
      buttonStyle: 'w-full',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () =>
      import('@plastik/auth/request-password').then(routes => routes.authRequestPasswordRoutes),
  },
  {
    path: '',
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
        path: 'admin',
        canActivate: [AuthGuard],
        data: {
          authGuardPipe: adminOnly,
          mustBeStored: true,
        },
        children: [
          {
            path: 'categoria',
            providers: [
              {
                provide: STORE_TOKEN,
                useExisting: LlecoopCategoryStore,
              },
            ],
            children: [
              {
                path: 'crear',
                loadChildren: () =>
                  import('@plastik/llecoop/category/detail').then(
                    routes => routes.categoryFeatureDetailCreateRoutes
                  ),
              },
              {
                path: ':id',
                loadChildren: () =>
                  import('@plastik/llecoop/category/detail').then(
                    routes => routes.categoryFeatureDetailUpdateRoutes
                  ),
              },
              {
                path: '',
                loadChildren: () =>
                  import('@plastik/llecoop/category/list').then(
                    routes => routes.llecoopCategoryFeatureRoutes
                  ),
              },
            ],
          },
          {
            path: 'producte',
            providers: [
              {
                provide: STORE_TOKEN,
                useExisting: LlecoopProductStore,
              },
            ],
            children: [
              {
                path: 'crear',
                loadChildren: () =>
                  import('@plastik/llecoop/product/detail').then(
                    routes => routes.productFeatureDetailCreateRoutes
                  ),
              },
              {
                path: ':id',
                loadChildren: () =>
                  import('@plastik/llecoop/product/detail').then(
                    routes => routes.productFeatureDetailUpdateRoutes
                  ),
              },
              {
                path: '',
                loadChildren: () =>
                  import('@plastik/llecoop/product/list').then(
                    routes => routes.llecoopProductFeatureListRoutes
                  ),
              },
            ],
          },
          {
            path: 'usuari',
            providers: [
              {
                provide: STORE_TOKEN,
                useExisting: LLecoopUserStore,
              },
            ],
            children: [
              {
                path: 'crear',
                loadChildren: () =>
                  import('@plastik/llecoop/user/create').then(
                    routes => routes.llecoopUserFeatureCreateRoutes
                  ),
              },
              {
                path: '',
                loadChildren: () =>
                  import('@plastik/llecoop/user/list').then(
                    routes => routes.llecoopUserFeatureListRoutes
                  ),
              },
            ],
          },
          {
            path: 'comanda',
            providers: [
              {
                provide: STORE_TOKEN,
                useExisting: LLecoopOrderListStore,
              },
            ],
            children: [
              {
                path: ':order-list-id',
                loadChildren: () =>
                  import('@plastik/llecoop/order-list/detail').then(
                    routes => routes.llecoopOrderListFeatureDetailRoutes
                  ),
              },
              {
                path: '',
                loadChildren: () =>
                  import('@plastik/llecoop/order-list/list').then(
                    routes => routes.llecoopOrderListFeatureListRoutes
                  ),
              },
            ],
          },
        ],
      },
      {
        path: 'soci',
        providers: [
          {
            provide: STORE_TOKEN,
            useExisting: LlecoopUserOrderStore,
          },
        ],
        children: [
          {
            path: 'comanda/crear',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/detail').then(
                routes => routes.llecoopUserOrderFeatureDetailCreateRoutes
              ),
          },
          {
            path: 'comanda/:id',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/detail').then(
                routes => routes.llecoopUserOrderFeatureDetailUpdateRoutes
              ),
          },
          {
            path: 'comanda',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/list').then(
                routes => routes.llecoopUserOrderFeatureListRoutes
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'soci/comanda',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'soci/comanda',
  },
];
