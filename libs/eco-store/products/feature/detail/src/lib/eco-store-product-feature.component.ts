import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

@Component({
  selector: 'eco-eco-store-product-feature',
  imports: [JsonPipe],
  templateUrl: './eco-store-product-feature.component.html',
  styleUrl: './eco-store-product-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductFeatureComponent {
  readonly #productsStore = inject(ecoStoreProductsStore);

  readonly selectedProduct = computed(() => {
    const selectedId = this.#productsStore.selectedItemId();
    if (!selectedId) return null;

    return this.#productsStore.entityMap()[selectedId] || null;
  });
}
