/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreProductCardComponent } from '@plastik/eco-store/product-card';
import { ecoStoreProductsStore } from '@plastik/eco-store/products/data-access';

@Component({
  selector: 'eco-store-products-feature',
  imports: [TranslateModule, EcoStoreProductCardComponent],
  templateUrl: './eco-store-products-feature.component.html',
  styleUrl: './eco-store-products-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EcoStoreProductsFeatureComponent {
  store = inject(ecoStoreProductsStore);

  addToCart({ id, quantity }: { id: EcoStoreProductWithCategoryName['id']; quantity: number }) {
    console.log(id, quantity);
  }

  toggleFavorite(id: EcoStoreProductWithCategoryName['id']) {
    console.log(id);
  }
}
