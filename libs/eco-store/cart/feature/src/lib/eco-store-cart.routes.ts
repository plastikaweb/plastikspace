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
        title: 'cart.summary.headTitle',
        canActivate: [pocketBaseIsLoggedGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/summary/cart-summary.component').then(
            m => m.CartSummaryComponent
          ),
      },
      {
        path: 'enviament',
        title: 'cart.shipping.headTitle',
        canActivate: [pocketBaseIsLoggedGuard, shippingAvailableGuard, isStoreOpenGuard],
        resolve: { addresses: cartShippingResolver },
        loadComponent: () =>
          import('./eco-store-cart-steps/shipping/cart-shipping.component').then(
            m => m.CartShippingComponent
          ),
      },
      {
        path: 'confirmacio',
        title: 'cart.confirmation.headTitle',
        canActivate: [pocketBaseIsLoggedGuard, shippingAvailableGuard, isStoreOpenGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/confirmation/cart-confirmation.component').then(
            m => m.CartConfirmationComponent
          ),
      },
      {
        path: 'pendent',
        title: 'cart.shipping.unavailable.headTitle',
        canActivate: [shippingUnavailableGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/shipping/shipping-unavailable/shipping-unavailable.component').then(
            m => m.ShippingUnavailableComponent
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
