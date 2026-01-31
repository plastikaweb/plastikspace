import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ecoStoreCartStore } from '@plastik/eco-store/cart/data-access';
import { EcoStoreSharedFavoriteButtonComponent } from '@plastik/eco-store/favorite-button';
import {
  EcoStoreProductCardComponent,
  EcoStoreProductQuantityControlComponent,
} from '@plastik/eco-store/product-card';
import { EcoStoreProductCategoryLabelComponent } from '@plastik/eco-store/product-category-label';
import { EcoStoreProductPriceComponent } from '@plastik/eco-store/product-price';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-eco-store-product-feature',
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    RouterLink,
    EcoStoreProductQuantityControlComponent,
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
  readonly #cartStore = inject(ecoStoreCartStore);
  readonly pendingChanges = computed(() => {
    const product = this.product();
    if (!product) return false;

    const currentQty = this.quantity();
    const storedQty = this.storeQuantity();

    // If item is in cart, compare with stored quantity
    if (storedQty > 0) {
      return currentQty !== storedQty;
    }

    // If not in cart, compare with default initial quantity
    const defaultQty =
      product.minQuantity > 0
        ? product.minQuantity
        : product.unitType === 'unit' || product.unitType.startsWith('unitWithFixed')
          ? 1
          : 0.1;

    return currentQty !== defaultQty;
  });

  readonly product = computed(() => {
    const selectedId = this.#productsStore.selectedItemId();
    if (!selectedId) return null;

    return this.#productsStore.productsWithTranslatedText().find(p => p.id === selectedId) || null;
  });

  readonly storeQuantity = computed(() => {
    const product = this.product();
    return product ? this.#cartStore.getItemCount(product.id)() : 0;
  });

  readonly isInCart = computed(() => this.storeQuantity() > 0);

  readonly quantity = linkedSignal(() => {
    const product = this.product();
    if (!product) return 0;

    const cartCount = this.storeQuantity();
    if (cartCount) return cartCount;

    return product.minQuantity > 0
      ? product.minQuantity
      : product.unitType === 'unit' || product.unitType.startsWith('unitWithFixed')
        ? 1
        : 0.1;
  });

  readonly isFavorite = signal(false);
  readonly activeThumbnailIndex = signal(0);

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
    const otherProducts = allProducts.filter(
      p => p.id !== currentProduct.id && p.categorySlug !== currentProduct.categorySlug
    );
    const combined = [...sameCategory, ...otherProducts];

    // Return first 6 unique products
    return combined.slice(0, 6);
  });

  toggleFavorite(): void {
    this.isFavorite.update(v => !v);
  }

  updateQuantity(quantity: number): void {
    this.quantity.set(quantity);
  }

  addToCart(quantity: number): void {
    const product = this.product();
    if (!product) return;
    this.#cartStore.addToCart(product, quantity);
  }
}
