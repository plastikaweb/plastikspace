import { ChangeDetectionStrategy, Component, inject, linkedSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ViewTransitionService } from '@plastik/shared/util/view-transition';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { CartProductCardComponent } from '../../ui/cart-product-card/cart-product-card.component';

@Component({
  selector: 'eco-cart-summary',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslatePipe,
    CartOrderSummaryComponent,
    CartProductCardComponent,
    EcoStoreSharedNoResultsComponent,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartStore = inject(ecoStoreCartStore);
  readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly viewTransitionService = inject(ViewTransitionService);

  /**
   * Computes skeleton items for the cart summary based on the number of items in the cart or a default count during initial sync.
   */
  protected readonly skeletonItems = linkedSignal({
    source: () => ({
      isSyncing: this.cartStore.isSyncing(),
      isSynced: this.cartStore.isSynced(),
      count: this.cartStore.itemsCount(),
    }),
    computation: s => {
      if (s.isSyncing && !s.isSynced) {
        const count = s.count > 0 ? s.count : 0;
        return Array(count).fill(0);
      }
      return [];
    },
  });

  onQuantityChange(event: { quantity: number; product: EcoStoreProductWithCategoryName }) {
    this.cartStore.addToCart(event.product, event.quantity);
  }
}
