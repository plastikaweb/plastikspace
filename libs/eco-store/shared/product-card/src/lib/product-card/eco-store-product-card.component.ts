import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct, EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { EcoStoreProductCardQuantityControlComponent } from './eco-store-product-card-quantity-control.component';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

@Component({
  selector: 'eco-store-product-card',
  imports: [
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    DecimalPipe,
    EcoStoreProductCardQuantityControlComponent,
    EcoStoreUnitChipComponent,
    SharedImgContainerComponent,
  ],
  templateUrl: './eco-store-product-card.component.html',
  styleUrl: './eco-store-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductCardComponent {
  product = input.required<EcoStoreProductWithCategoryName>();
  isFirst = input.required<boolean>();
  quantity = signal(0); // TODO: This should come from the parent component as an input

  addToCart = output<{ id: EcoStoreProductWithCategoryName['id']; quantity: number }>();
  toggleFavorite = output<EcoStoreProductWithCategoryName['id']>();

  getPocketBaseUrl(product: EcoStoreProduct): string | null {
    const image = product.images?.[0];
    return image ? `${product.collectionId}/${product.id}/${image}` : null;
  }

  onQuantityChange(newQuantity: number) {
    this.quantity.set(newQuantity); // TODO: This should come from the parent component
    this.addToCart.emit({ id: this.product().id, quantity: newQuantity });
  }
}
