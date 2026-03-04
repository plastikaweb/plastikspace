import { Route } from '@angular/router';
import { OrderConfirmationComponent } from './order-confirmation.component';

export const ecoStoreOrderConfirmationRoutes: Route[] = [
  {
    path: ':id',
    component: OrderConfirmationComponent,
  },
];
