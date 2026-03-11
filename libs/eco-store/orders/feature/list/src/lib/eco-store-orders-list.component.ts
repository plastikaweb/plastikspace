import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { PaginationComponent } from '@plastik/pagination/ui';
import { PocketbasePaginationNavigationDirective } from '@plastik/pagination/util';
import { OrderCardComponent } from './order-card/order-card.component';

@Component({
  selector: 'eco-store-orders-list',
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    OrderCardComponent,
    PocketbasePaginationNavigationDirective,
    PaginationComponent,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './eco-store-orders-list.component.html',
  styleUrl: './eco-store-orders-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreOrdersListComponent {
  protected readonly ordersStore = inject(ecoStoreOrdersStore);

  protected readonly skeletonItems = linkedSignal({
    source: () => ({
      isLoading: this.ordersStore.isLoading(),
      perPage: this.ordersStore.getPagination().perPage,
      page: this.ordersStore.getPagination().page,
      count: this.ordersStore.count(),
    }),
    computation: s => {
      if (s.isLoading) {
        if (!s.count) {
          return Array(s.perPage).fill(0);
        }
        const remaining = s.count - s.page * s.perPage;
        const count = Math.max(0, Math.min(s.perPage, remaining));
        return Array(count).fill(0);
      }
      return [];
    },
  });
}
