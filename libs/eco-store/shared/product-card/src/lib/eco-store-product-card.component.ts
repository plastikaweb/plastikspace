import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreSharedFavoriteButtonComponent } from '@plastik/eco-store/favorite-button';
import { EcoStoreProductCategoryLabelComponent } from '@plastik/eco-store/product-category-label';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/product-price';
import { EcoStoreProductQuantityComponent } from '@plastik/eco-store/product-quantity';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-store-product-card',
  imports: [
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    EcoStoreProductQuantityComponent,
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
  quantity = input<number>(0);
  isOpen = input<boolean>(true);
  isActiveForTransition = input<boolean>(false);

  addToCart = output<{ product: EcoStoreProductWithCategoryName; quantity: number }>();
  toggleFavorite = output<EcoStoreProductWithCategoryName['id']>();
  getProduct = output<{
    category: EcoStoreProductWithCategoryName['category'];
    id: EcoStoreProductWithCategoryName['id'];
  }>();

  onQuantityChange(quantity: number) {
    const product = this.product();
    if (product) {
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
