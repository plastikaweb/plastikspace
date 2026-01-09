import { Route } from '@angular/router';
import { EcoStoreCartComponent } from './eco-store-cart/eco-store-cart.component';
import { pocketBaseIsLoggedGuard } from '@plastik/auth/pocketbase/data-access';

export const ecoStoreCartRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreCartComponent,
    children: [
      {
        path: 'resum',
        loadComponent: () =>
          import('./eco-store-cart-steps/summary/cart-summary.component').then(
            m => m.CartSummaryComponent
          ),
      },
      {
        path: 'enviament',
        canActivate: [pocketBaseIsLoggedGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/cart-shipping.component').then(
            m => m.CartShippingComponent
          ),
      },
      {
        path: 'pagament',
        canActivate: [pocketBaseIsLoggedGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/cart-payment.component').then(m => m.CartPaymentComponent),
      },
      {
        path: 'confirmacio',
        canActivate: [pocketBaseIsLoggedGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/cart-confirmation.component').then(
            m => m.CartConfirmationComponent
          ),
      },
      {
        path: '',
        redirectTo: 'resum',
        pathMatch: 'full',
      },
    ],
  },
];
