import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'plastik-user-order-mini-cart',
  standalone: true,
  imports: [
    DecimalPipe,
    MatListModule,
    FormsModule,
    MatDividerModule,
    SharedImgContainerComponent,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    LlecoopProductUnitSuffixPipe,
    LlecoopProductUnitStepPipe,
  ],
  templateUrl: './user-order-mini-cart.html',
  styleUrls: ['./user-order-mini-cart.scss'],
  host: {
    role: 'listbox',
    'aria-label': 'carrito de la compra',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderMiniCart {
  readonly cart = input<LlecoopProductWithQuantity[]>([]);
  readonly total = input<number>(0);
  updateQuantity = output<LlecoopProductWithQuantity>();

  onQuantityChange(item: LlecoopProductWithQuantity, value: string): void {
    this.updateQuantity.emit({
      ...item,
      quantity: Number(value),
    });
  }

  removeItemFromCart(item: LlecoopProductWithQuantity): void {
    this.updateQuantity.emit({ ...item, quantity: 0 });
  }
}
