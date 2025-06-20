import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { EntityId } from '@ngrx/signals/entities';
import { LlecoopProductWithQuantity } from '@plastik/llecoop/entities';
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
  product = input.required<LlecoopProductWithQuantity>();
  index = input<number>(0);

  totalPrice = computed(() => this.product()?.priceWithIva * this.product().quantity || 0);

  viewDetails = output<EntityId>();
  addToCart = output<LlecoopProductWithQuantity>();

  onViewDetails(): void {
    this.viewDetails.emit(this.product().id || '');
  }

  onQuantityChange(value: string): void {
    this.addToCart.emit({ ...this.product(), quantity: Number(value) });
  }
}
