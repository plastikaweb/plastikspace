import { Route } from '@angular/router';
import { pocketBaseIsLoggedGuard } from '@plastik/auth/pocketbase/data-access';
import { cartShippingResolver } from './eco-store-cart-steps/shipping/cart-shipping.resolver';
import { EcoStoreCartComponent } from './eco-store-cart/eco-store-cart.component';
import { isStoreOpenGuard } from './guards/is-store-open.guard';
import { shippingAvailableGuard } from './guards/shipping-available.guard';
import { shippingUnavailableGuard } from './guards/shipping-unavailable.guard';

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
        canActivate: [pocketBaseIsLoggedGuard, shippingAvailableGuard, isStoreOpenGuard],
        resolve: { addresses: cartShippingResolver },
        loadComponent: () =>
          import('./eco-store-cart-steps/shipping/cart-shipping.component').then(
            m => m.CartShippingComponent
          ),
      },
      {
        path: 'confirmacio',
        canActivate: [pocketBaseIsLoggedGuard, shippingAvailableGuard, isStoreOpenGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/confirmation/cart-confirmation.component').then(
            m => m.CartConfirmationComponent
          ),
      },
      {
        path: 'pendent',
        canActivate: [shippingUnavailableGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/shipping/shipping-unavailable/shipping-unavailable.component').then(
            m => m.ShippingUnavailableComponent
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./eco-store-cart-steps/finish/cart-finish.component').then(
            m => m.CartFinishComponent
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
