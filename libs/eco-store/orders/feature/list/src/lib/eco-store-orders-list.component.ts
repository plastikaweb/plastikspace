import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SortConfig } from '@plastik/core/entities';
import { EcoStoreOrder, ORDER_STATUS_LABEL_MAP } from '@plastik/eco-store/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { ecoStoreOrdersStore, OrdersPocketBaseFilter } from '@plastik/eco-store/orders/data-access';
import { PaginationComponent } from '@plastik/pagination/ui';
import { PocketbasePaginationNavigationDirective } from '@plastik/pagination/util';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { SelectWithIconsFormlyModule } from '@plastik/shared/form/select-with-icons';
import { SortSelectorComponent } from '@plastik/sort-selector';
import { filter, take } from 'rxjs';
import {
  EcoStoreOrdersFilterData,
  ecoStoreOrdersFilterFormConfig,
} from './eco-store-orders-filter-form.config';
import { OrderCardComponent } from './order-card/order-card.component';

@Component({
  selector: 'eco-store-orders-list',
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    OrderCardComponent,
    PocketbasePaginationNavigationDirective,
    PaginationComponent,
    TranslatePipe,
    SharedFormFeatureModule,
    SelectWithIconsFormlyModule,
    EcoStoreSharedNoResultsComponent,
    SortSelectorComponent,
  ],
  templateUrl: './eco-store-orders-list.component.html',
  styleUrl: './eco-store-orders-list.component.scss',
  host: {
    role: 'region',
    '[attr.aria-busy]': 'ordersStore.isLoading()',
    '[attr.inert]': 'ordersStore.isLoading() ? "" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreOrdersListComponent {
  protected readonly ordersStore = inject(ecoStoreOrdersStore);
  protected readonly formConfig = ecoStoreOrdersFilterFormConfig();
  protected readonly orderStatusLabelMap = ORDER_STATUS_LABEL_MAP;
  readonly #confirmService = inject(SharedConfirmDialogService);

  readonly #router = inject(Router);

  protected readonly model = computed<EcoStoreOrdersFilterData>(() => this.ordersStore.filter());

  protected readonly searchByItems = computed(
    () => (this.ordersStore.filter() as OrdersPocketBaseFilter).items
  );

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

  onChange(event: EcoStoreOrdersFilterData): void {
    this.#router.navigate([], {
      queryParams: { ...event, page: 0 },
      queryParamsHandling: 'merge',
    });
  }

  public sort(sort: SortConfig) {
    this.#router.navigate([], {
      queryParams: { ...sort, page: 0 },
      queryParamsHandling: 'merge',
    });
  }

  protected onDeleteOrder([orderId, orderNumber]: [
    EcoStoreOrder['id'],
    EcoStoreOrder['orderNumber'],
  ]) {
    this.#confirmService
      .confirm(
        'orders.list.deleteOrderTitle',
        'orders.list.deleteOrderDescription',
        'orders.list.deleteOrderCancel',
        'orders.list.deleteOrderConfirm',
        { orderNumber }
      )
      .pipe(take(1), filter(Boolean))
      .subscribe(() => this.ordersStore.delete(orderId));
  }
}
