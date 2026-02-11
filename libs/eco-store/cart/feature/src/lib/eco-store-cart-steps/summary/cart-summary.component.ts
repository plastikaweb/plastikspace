import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/product-price';
import { EcoStoreProductQuantityComponent } from '@plastik/eco-store/product-quantity';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { CartOrderSummaryComponent } from '../../ui/cart-order-summary/cart-order-summary.component';
import { NewPriceWarningComponent } from '../../ui/new-price-warning/new-price-warning.component';

@Component({
  selector: 'eco-cart-summary',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CurrencyPipe,
    TranslatePipe,
    KeyValuePipe,
    PocketBaseImageUrlPipe,
    SharedImgContainerComponent,
    EcoStoreProductPriceComponent,
    EcoStoreProductQuantityComponent,
    CartOrderSummaryComponent,
    NewPriceWarningComponent,
    RouterLink,
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartSummaryComponent {
  readonly cartStore = inject(ecoStoreCartStore);
  readonly tenantStore = inject(ecoStoreTenantStore);

  onQuantityChange(event: number, product: EcoStoreProductWithCategoryName) {
    this.cartStore.addToCart(product, event);
  }
}
