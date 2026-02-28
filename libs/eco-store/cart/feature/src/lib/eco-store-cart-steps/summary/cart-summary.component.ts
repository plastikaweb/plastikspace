import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
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
    KeyValuePipe,
    CartOrderSummaryComponent,
    CartProductCardComponent,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartStore = inject(ecoStoreCartStore);
  readonly tenantStore = inject(ecoStoreTenantStore);
  protected readonly viewTransitionService = inject(ViewTransitionService);

  onQuantityChange(event: { quantity: number; product: EcoStoreProductWithCategoryName }) {
    this.cartStore.addToCart(event.product, event.quantity);
  }
}
