import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material/paginator';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { LlecoopCategoryStore } from '@plastik/llecoop/category/data-access';
import { STORE_TOKEN } from '@plastik/llecoop/data-access';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';
import { LlecoopProductStore } from '@plastik/llecoop/product/data-access';
import { LLecoopUserStore } from '@plastik/llecoop/user/data-access';

import { CmsLayoutComponent } from './cms-layout.component';
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
