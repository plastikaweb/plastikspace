import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ORDER_STATUS_LABEL_MAP } from '@plastik/eco-store/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { PaginationComponent } from '@plastik/pagination/ui';
import { PocketbasePaginationNavigationDirective } from '@plastik/pagination/util';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { SelectWithIconsFormlyModule } from '@plastik/shared/form/select-with-icons';
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
  ],
  templateUrl: './eco-store-orders-list.component.html',
  styleUrl: './eco-store-orders-list.component.scss',
  host: {
    role: 'main',
    class: 'flex flex-1 flex-col px-4 py-8',
    '[attr.aria-busy]': 'ordersStore.isLoading()',
    '[attr.inert]': 'ordersStore.isLoading()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreOrdersListComponent {
  protected readonly ordersStore = inject(ecoStoreOrdersStore);
  protected readonly formConfig = ecoStoreOrdersFilterFormConfig();
  protected readonly orderStatusLabelMap = ORDER_STATUS_LABEL_MAP;
  readonly #router = inject(Router);

  protected readonly model = computed<EcoStoreOrdersFilterData>(() => this.ordersStore.filter());

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
}
