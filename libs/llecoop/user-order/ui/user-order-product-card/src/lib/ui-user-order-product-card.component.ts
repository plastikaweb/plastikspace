import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopProduct } from '@plastik/llecoop/entities';
import { LlecoopProductBaseUnitTextPipe } from '@plastik/llecoop/product/product-base-unit-text';
import { LlecoopProductUnitStepPipe } from '@plastik/llecoop/product/product-unit-step';
import { LlecoopProductUnitSuffixPipe } from '@plastik/llecoop/product/product-unit-suffix';
import { HexToRgbaPipe } from '@plastik/shared/hex-to-rgba';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'plastik-ui-user-order-product-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    TitleCasePipe,
    HexToRgbaPipe,
    CurrencyPipe,
    SharedImgContainerComponent,
    LlecoopProductBaseUnitTextPipe,
    LlecoopProductUnitStepPipe,
    LlecoopProductUnitSuffixPipe,
  ],
  templateUrl: './ui-user-order-product-card.component.html',
  styleUrl: './ui-user-order-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiUserOrderProductCardComponent {
  product = input.required<LlecoopProduct>();
  quantity = model<number>(0);
  index = input<number>(0);

  totalPrice = computed(() => this.product()?.priceWithIva * this.quantity() || 0);

  viewDetails = output<EntityId>();
  addToCart = output<{ product: LlecoopProduct; quantity: number }>();

  #isFirstChange = true;

  constructor() {
    effect(() => {
      // Get the current quantity value to trigger the effect
      const currentQuantity = this.quantity();

      // Only emit if it's not the first change
      if (!this.#isFirstChange) {
        this.addToCart.emit({ product: this.product(), quantity: currentQuantity });
      } else {
        // Mark first change as complete
        this.#isFirstChange = false;
      }
    });
  }

  onAddToCart(): void {
    this.quantity.set(1);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.product().id || '');
  }

  onQuantityChange(value: string): void {
    this.quantity.set(Number(value));
  }
}
