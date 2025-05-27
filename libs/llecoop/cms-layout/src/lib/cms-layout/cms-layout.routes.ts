import { DATE_PIPE_DEFAULT_OPTIONS, IMAGE_LOADER } from '@angular/common';
import { DEFAULT_CURRENCY_CODE, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MAT_PAGINATOR_DEFAULT_OPTIONS, MatPaginatorIntl } from '@angular/material/paginator';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { ENVIRONMENT } from '@plastik/core/environments';
import { LlecoopEnvironment } from '@plastik/llecoop/entities';
import { imageKitLoader } from '@plastik/storage/data-access';

import { LlecoopMatPaginatorIntl } from './mat-paginator-intl.service';

/**
 * @returns {LlecoopEnvironment} The environment object.
 */
function getEnvironment(): LlecoopEnvironment {
  return inject(ENVIRONMENT) as LlecoopEnvironment;
}

const hasCustomClaim = (claim: string) => async (): Promise<boolean> => {
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
    loadComponent: () => import('./cms-layout.component').then(m => m.CmsLayoutComponent),
    providers: [
      {
        provide: IMAGE_LOADER,
        useFactory: () =>
          imageKitLoader(
            getEnvironment().imageKit.endpoint,
            `/v0/b/${getEnvironment().firebase.storageBucket}/o/`
          ),
      },
      {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'EUR',
      },
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: {
          dateFormat: 'dd/MM/yyyy',
        },
      },
      {
        provide: MatPaginatorIntl,
        useClass: LlecoopMatPaginatorIntl,
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
        path: 'categories',
        canActivate: [customAuthGuard],
        data: {
          authGuardPipe: adminOnly,
          mustBeStored: true,
        },
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
        path: 'productes',
        canActivate: [customAuthGuard],
        data: {
          authGuardPipe: adminOnly,
          mustBeStored: true,
        },
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
        path: 'usuaris',
        canActivate: [customAuthGuard],
        data: {
          authGuardPipe: adminOnly,
          mustBeStored: true,
        },
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
        path: 'perfil',
        loadChildren: () =>
          import('@plastik/llecoop/profile').then(routes => routes.profileFeatureRoutes),
      },
      {
        path: 'comandes',
        children: [
          {
            path: 'totes',
            canActivate: [customAuthGuard],
            data: {
              authGuardPipe: adminOnly,
              mustBeStored: true,
            },
            loadChildren: () =>
              import('@plastik/llecoop/order-list-user-order').then(
                routes => routes.llecoopOrderListUserOrdersListRoutes
              ),
          },
          {
            path: 'setmanals',
            canActivate: [customAuthGuard],
            data: {
              authGuardPipe: adminOnly,
              mustBeStored: true,
            },
            loadChildren: () =>
              import('@plastik/llecoop/order-list/list').then(
                routes => routes.llecoopOrderListFeatureListRoutes
              ),
          },
          {
            path: 'crear',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/detail').then(
                routes => routes.llecoopUserOrderFeatureDetailCreateRoutes
              ),
          },
          {
            path: ':id/resum',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/resume').then(
                routes => routes.llecoopUserOrderFeatureResumeRoutes
              ),
          },
          {
            path: ':id',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/detail').then(
                routes => routes.llecoopUserOrderFeatureDetailUpdateRoutes
              ),
          },
          {
            path: '',
            loadChildren: () =>
              import('@plastik/llecoop/user-order/list').then(
                routes => routes.llecoopUserOrderFeatureListRoutes
              ),
          },
        ],
      },
      {
        path: '',
        redirectTo: 'comandes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'comandes',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'comandes',
  },
];
