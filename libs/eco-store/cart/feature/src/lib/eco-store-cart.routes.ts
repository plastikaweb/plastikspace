import { importProvidersFrom } from '@angular/core';
import { Route } from '@angular/router';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { cartShippingResolver } from './eco-store-cart-steps/shipping/cart-shipping.resolver';
import { EcoStoreCartComponent } from './eco-store-cart/eco-store-cart.component';
import { emptyCartGuard } from './guards/empty-card.guard';
import { isStoreOpenGuard } from './guards/is-store-open.guard';
import { ecoStoreNotLoggedShippingGuard } from './guards/not-logged-shipping.guard';
import { shippingAvailableGuard } from './guards/shipping-available.guard';
import { shippingInfoGuard } from './guards/shipping-info.guard';
import { shippingUnavailableGuard } from './guards/shipping-unavailable.guard';

export const ecoStoreCartRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreCartComponent,
    canActivateChild: [emptyCartGuard],
    providers: [importProvidersFrom(EcoStoreFormlyModule)],
    resolve: { addresses: cartShippingResolver },
    children: [
      {
        path: 'resum',
        title: 'cart.summary.headTitle',
        loadComponent: () =>
          import('./eco-store-cart-steps/summary/cart-summary.component').then(
            m => m.CartSummaryComponent
          ),
      },
      {
        path: 'enviament',
        title: 'cart.shipping.headTitle',
        canActivate: [ecoStoreNotLoggedShippingGuard, shippingAvailableGuard, isStoreOpenGuard],
        loadComponent: () =>
          import('./eco-store-cart-steps/shipping/cart-shipping.component').then(
            m => m.CartShippingComponent
          ),
      },
      {
        path: 'confirmacio',
        title: 'cart.confirmation.headTitle',
        canActivate: [
          ecoStoreNotLoggedShippingGuard,
          shippingAvailableGuard,
          isStoreOpenGuard,
          shippingInfoGuard,
        ],
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
