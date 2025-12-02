import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';
import { EcoStoreProductCardQuantityControlComponent } from './eco-store-product-card-quantity-control.component';

@Component({
  selector: 'eco-store-product-card',
  imports: [
    TranslateModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIcon,
    MatChip,
    DecimalPipe,
    EcoStoreProductCardQuantityControlComponent,
  ],
  templateUrl: './eco-store-product-card.component.html',
  styleUrl: './eco-store-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductCardComponent {
  product = input.required<EcoStoreProductWithCategoryName>();
  quantity = signal(0); // TODO: This should come from the parent component as an input

  addToCart = output<{ id: EcoStoreProductWithCategoryName['id']; quantity: number }>();
  toggleFavorite = output<EcoStoreProductWithCategoryName['id']>();

  onQuantityChange(newQuantity: number) {
    this.quantity.set(newQuantity); // TODO: This should come from the parent component
    this.addToCart.emit({ id: this.product().id, quantity: newQuantity });
  }
}
