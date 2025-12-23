import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import {
  EcoStoreProductCardQuantityControlComponent,
  EcoStoreProductCardComponent,
} from '@plastik/eco-store/product-card';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/shared/product-price';
import { EcoStoreProductCategoryLabelComponent } from '@plastik/eco-store/shared/product-category-label';
import { EcoStoreSharedFavoriteButtonComponent } from '@plastik/eco-store/shared/favorite-button';

@Component({
  selector: 'eco-eco-store-product-feature',
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    RouterLink,
    EcoStoreProductCardQuantityControlComponent,
    EcoStoreProductCardComponent,
    EcoStoreProductPriceComponent,
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
    EcoStoreProductCategoryLabelComponent,
    EcoStoreSharedFavoriteButtonComponent,
  ],
  templateUrl: './eco-store-product-feature.component.html',
  styleUrl: './eco-store-product-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductFeatureComponent {
  readonly #productsStore = inject(ecoStoreProductsStore);

  readonly product = computed(() => {
    const selectedId = this.#productsStore.selectedItemId();
    if (!selectedId) return null;

    return this.#productsStore.productsWithTranslatedText().find(p => p.id === selectedId) || null;
  });

  readonly quantity = signal(1);
  readonly isFavorite = signal(false);
  readonly activeThumbnailIndex = signal(0);

  readonly #effect = effect(() => {
    const product = this.product();
    if (product) {
      this.quantity.set(
        product.minQuantity > 0
          ? product.minQuantity
          : product.unitType === 'unit' || product.unitType.startsWith('unitWithFixed')
            ? 1
            : 0.1
      );
    }
  });

  // Mocked data as requested for missing fields
  readonly productTags = [
    { label: 'ECO', class: 'bg-green-100/60!', icon: 'eco' },
    {
      label: 'NOVETAT',
      class: 'bg-blue-100/60!',
      icon: 'auto_awesome',
    },
    { label: 'OFERTA', class: 'bg-red-100/60!', icon: 'local_offer' },
  ];

  readonly isVariableWeight = computed(() => {
    const product = this.product();
    if (!product) return false;
    const type = product.unitType;
    return type !== 'unit' && !type.startsWith('unitWithFixed');
  });

  readonly rating = {
    score: 4.8,
    count: 124,
  };

  readonly mainImageDimensions = { width: 700, height: 700 };
  readonly thumbnailDimensions = { width: 150, height: 150 };

  // Stock status with visual feedback (mocked for now)
  readonly stockStatus = computed(() => {
    const stock = this.product()?.stock || 0;

    if (stock === 0) {
      return {
        status: 'out' as const,
        message: 'Esgotat',
        icon: 'cancel',
      };
    } else if (stock < 10) {
      return {
        status: 'low' as const,
        message: `Poques unitats (${stock} disponibles)`,
        icon: 'warning',
      };
    } else {
      return {
        status: 'available' as const,
        message: `Disponible (Entrega 24/48h)`,
        icon: 'check_circle',
      };
    }
  });

  // Related products (mock with random products from store)
  readonly relatedProducts = computed(() => {
    const allProducts = this.#productsStore.productsWithTranslatedText();
    const currentProduct = this.product();

    if (!currentProduct || allProducts.length === 0) return [];

    // Get products from same category, excluding current product
    const sameCategory = allProducts.filter(
      p => p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id
    );

    // If not enough in same category, add other products
    const otherProducts = allProducts.filter(p => p.id !== currentProduct.id);
    const combined = [...sameCategory, ...otherProducts];

    // Return first 6 unique products
    return combined.slice(0, 6);
  });

  toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }

  onQuantityChange(newQuantity: number): void {
    this.quantity.set(newQuantity);
  }

  addToCart(_quantity: number): void {
    // eslint-disable-next-line no-console
    console.log(_quantity);
    // TODO: Connect to cart store/service when available
  }
}
