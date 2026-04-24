import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CartProductCardComponent } from '@plastik/eco-store/cart';
import {
  EcoStoreProductWithCategoryName,
  ORDER_DELIVERY_ICON_MAP,
  ORDER_DELIVERY_LABEL_MAP,
  ORDER_STATUS_ICON_MAP,
  ORDER_STATUS_LABEL_MAP,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_TYPE_MAP,
} from '@plastik/eco-store/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';
import { EcoStorePriceSummaryComponent } from '@plastik/eco-store/price-summary';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';
import { SharedChipComponent } from '@plastik/shared/chip/ui';

@Component({
  selector: 'eco-store-orders-detail',
  imports: [
    TranslatePipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SharedChipComponent,
    SharedAlertUiComponent,
    EcoStorePriceSummaryComponent,
    CartProductCardComponent,
    RouterLink,
    EcoStoreSharedNoResultsComponent,
  ],
  templateUrl: './eco-store-orders-detail.component.html',
  styleUrl: './eco-store-orders-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreOrdersDetailComponent {
  readonly #ordersStore = inject(ecoStoreOrdersStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #translate = inject(TranslateService);

  // TODO: Make this reactive if language switching within the same view session is required.
  // Using a simple signal for now to avoid SSR stabilization issues.
  protected readonly currentLanguage = signal(this.#translate.getCurrentLang());

  protected readonly isLoading = computed(() => this.#ordersStore.isLoading());
  protected readonly order = computed(() => {
    const selectedId = this.#ordersStore.selectedItemId();
    if (!selectedId) {
      return null;
    }
    return this.#ordersStore.getItemById(selectedId);
  });

  protected readonly statusLabel = computed(() => {
    const status = this.order()?.status;
    return status ? ORDER_STATUS_LABEL_MAP[status] : '';
  });

  protected readonly statusType = computed(() => {
    const status = this.order()?.status;
    return status ? ORDER_STATUS_TYPE_MAP[status] : 'neutral';
  });

  protected readonly statusIcon = computed(() => {
    const status = this.order()?.status;
    return status ? ORDER_STATUS_ICON_MAP[status] : '';
  });

  protected readonly statusConfig = computed(() => {
    const status = this.order()?.status;
    return ORDER_STATUS_OPTIONS.find(opt => opt.value === status);
  });

  protected readonly deliveryIcon = computed(() => {
    const method = this.order()?.deliveryMethod;
    return method ? ORDER_DELIVERY_ICON_MAP[method] : '';
  });

  protected readonly deliveryLabel = computed(() => {
    const method = this.order()?.deliveryMethod;
    return method ? ORDER_DELIVERY_LABEL_MAP[method] : '';
  });

  protected readonly isPending = computed(() =>
    ['PENDING', 'CONFIRMED'].includes(this.order()?.status ?? '')
  );

  protected readonly isShippingFree = computed(() => (this.order()?.shipping ?? 0) === 0);

  protected readonly taxRate = computed(() => {
    const items = this.order()?.items ?? [];
    const firstTaxRate = items.find(i => i.taxRate != null)?.taxRate;
    return firstTaxRate != null ? firstTaxRate * 100 : 10;
  });

  protected readonly cartItems = computed(() => {
    const order = this.order();
    const lang = this.currentLanguage();
    if (!order) return [];
    return order.items.map(item => ({
      product: {
        id: item.productId,
        name: this.getItemName(item.name, lang),
        categoryName: this.getItemName(item.categoryName, lang),
        priceWithIva: item.lockedPrice,
        iva: (item.taxRate ?? 0.1) * 100,
        unitType: item.unitType,
        unitBase: 1,
        images: [], // Images are not in the snapshot
        categorySlug: '', // Slug not in snapshot
        normalizedName: '', // Normalized name not in snapshot
      } as unknown as EcoStoreProductWithCategoryName,
      quantity: item.requestedQuantity,
    }));
  });

  protected goBack(): void {
    this.#router.navigate(['/comandes']);
  }

  protected getItemName(name: string | Record<string, string>, lang: string): string {
    if (typeof name === 'string') return name;
    return name[lang] ?? name['ca'] ?? Object.values(name)[0] ?? '';
  }
}
