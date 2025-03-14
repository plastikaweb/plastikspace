import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material/paginator';
import { CanActivateFn, Router, Routes } from '@angular/router';

import { CmsLayoutComponent } from './cms-layout.component';
import { loadProfileResolver } from './load-profile.resolver';
import { LlecoopMatPaginatorIntl } from './mat-paginator-intl.service';

const hasCustomClaim = (claim: string) => async () => {
  const auth = inject(Auth);
  const idTokenResult = await auth.currentUser?.getIdTokenResult();
  return !!idTokenResult?.claims[claim];
};

const adminOnly = () => hasCustomClaim('isAdmin');

const customAuthGuard: CanActivateFn = async route => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.currentUser) {
    await router.navigate(['/']);
    return false;
  }

  const authPipe = route.data['authGuardPipe']?.();
  if (!authPipe) return true;

  const isAuthorized = await authPipe();
  if (!isAuthorized) {
    await router.navigate(['/']);
  }
  return isAuthorized;
};

export const llecoopLayoutRoutes: Routes = [
  {
    path: '',
    component: CmsLayoutComponent,
    providers: [
      {
        provide: MatPaginatorIntl,
        useClass: LlecoopMatPaginatorIntl,
      },
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: {
          appearance: 'fill',
        },
      },
      {
        provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
        useValue: {
          pageSize: 10,
          pageSizeOptions: [5, 10, 25],
          showFirstLastButtons: false,
        },
      },
    ],
    resolve: {
      resolveUser: loadProfileResolver,
    },
    children: [
      {
        path: 'admin',
        canActivate: [customAuthGuard],
        data: {
          authGuardPipe: adminOnly,
          mustBeStored: true,
        },
        children: [
          {
            path: 'categoria',
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
        children: [
          {
            path: 'comanda/crear',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/detail').then(
                routes => routes.llecoopUserOrderFeatureDetailCreateRoutes
              ),
          },
          {
            path: 'comanda/resum/:id',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/resume').then(
                routes => routes.llecoopUserOrderFeatureResumeRoutes
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
          {
            path: 'perfil',
            loadChildren: () =>
              import('@plastik/llecoop/profile').then(routes => routes.profileFeatureRoutes),
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
