import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { EcoStoreProductCardQuantityControlComponent } from './eco-store-product-card-quantity-control.component';
import { RouterLink } from '@angular/router';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { EcoStoreProductCategoryLabelComponent } from '@plastik/eco-store/shared/product-category-label';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/shared/product-price';
import { EcoStoreSharedFavoriteButtonComponent } from '@plastik/eco-store/shared/favorite-button';

@Component({
  selector: 'eco-store-product-card',
  imports: [
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    EcoStoreProductCardQuantityControlComponent,
    EcoStoreProductPriceComponent,
    SharedImgContainerComponent,
    RouterLink,
    PocketBaseImageUrlPipe,
    EcoStoreProductCategoryLabelComponent,
    EcoStoreSharedFavoriteButtonComponent,
  ],
  templateUrl: './eco-store-product-card.component.html',
  styleUrl: './eco-store-product-card.component.scss',
  host: {
    class: 'cursor-pointer',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductCardComponent {
  product = input<EcoStoreProductWithCategoryName | null>(null);
  isFirst = input<boolean>(false);
  minimalVersion = input<boolean>(false);
  quantity = signal(0); // TODO: This should come from the parent component as an input

  addToCart = output<{ product: EcoStoreProductWithCategoryName; quantity: number }>();
  toggleFavorite = output<EcoStoreProductWithCategoryName['id']>();
  getProduct = output<{
    category: EcoStoreProductWithCategoryName['category'];
    id: EcoStoreProductWithCategoryName['id'];
  }>();

  onQuantityChange(quantity: number) {
    const product = this.product();
    if (product) {
      this.quantity.set(quantity); // TODO: This should come from the parent component
      this.addToCart.emit({ product, quantity });
    }
  }

  onToggleFavorite(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const product = this.product();
    if (product) {
      this.toggleFavorite.emit(product.id);
    }
  }
}
