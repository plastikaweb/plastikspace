import { Route } from '@angular/router';
import { OrderConfirmationComponent } from './order-confirmation.component';

export const ecoStoreOrderConfirmationRoutes: Route[] = [
  {
    path: ':id',
    title: 'cart.finish.title',
    component: OrderConfirmationComponent,
  },
];
