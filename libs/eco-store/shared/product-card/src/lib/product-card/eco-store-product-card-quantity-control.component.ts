import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  untracked,
} from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProductWithCategoryName } from '@plastik/eco-store/entities';

@Component({
  selector: 'eco-store-product-card-quantity-control',
  imports: [TranslateModule, MatIcon, MatButton, MatIconButton, MatInput],
  templateUrl: './eco-store-product-card-quantity-control.component.html',
  styleUrl: './eco-store-product-card-quantity-control.component.scss',
  host: {
    class: 'block w-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductCardQuantityControlComponent {
  readonly product = input.required<EcoStoreProductWithCategoryName>();
  readonly quantity = input<number>(0);
  readonly mode = input<'card' | 'detail'>('card');
  readonly isInCart = input<boolean>(false);

  readonly quantityChange = output<number>();
  readonly addToCart = output<number>();

  protected readonly individualButton = computed(
    () => this.quantity() > 0 || this.mode() === 'detail'
  );

  protected readonly initialQuantity = linkedSignal({
    source: this.product,
    computation: () => untracked(() => this.quantity()),
  });

  protected readonly isQuantityModified = computed(
    () => this.quantity() !== this.initialQuantity() || !this.isInCart()
  );

  protected readonly step = computed(() => {
    const type = this.product().unitType;
    return type === 'unit' || type.startsWith('unitWithFixed') ? 1 : 0.1;
  });

  protected readonly minLimit = computed(() => {
    const min = this.product().minQuantity;
    return min > 0 ? min : this.step();
  });

  protected readonly maxLimit = computed(() => {
    const max = this.product().maxQuantity || this.product().stock;
    return max > 0 ? max : Infinity;
  });

  protected readonly hasItems = computed(() => this.quantity() > 0);

  updateQuantity(delta: number) {
    const current = this.quantity();
    const next = this.round(current + delta);

    this.validateAndSet(next);
  }

  onIncrementClick(event: Event) {
    this.stopEvent(event);
    this.increment();
  }

  increment() {
    if (this.quantity() === 0 && this.minLimit() > 0) {
      this.validateAndSet(this.minLimit());
      return;
    }
    this.updateQuantity(this.step());
  }

  onDecrementClick(event: Event) {
    this.stopEvent(event);
    this.decrement();
  }

  decrement() {
    const current = this.quantity();

    if (current <= this.minLimit()) {
      if (this.mode() === 'detail') return;

      this.quantityChange.emit(0);
      return;
    }

    this.updateQuantity(-this.step());
  }

  onManualInput(event: Event) {
    this.stopEvent(event);
    const inputElement = event.target as HTMLInputElement;
    const value = parseFloat(inputElement.value);

    if (isNaN(value)) {
      inputElement.value = this.quantity().toString();
      return;
    }

    this.validateAndSet(value);

    if (inputElement.value !== this.quantity().toString()) {
      inputElement.value = this.quantity().toString();
    }
  }

  onAddToCart(): void {
    this.addToCart.emit(this.quantity());
    this.initialQuantity.set(this.quantity());
  }

  private validateAndSet(value: number) {
    let finalValue = value;

    if (finalValue < 0) {
      finalValue = 0;
    } else if (finalValue > 0 && finalValue < this.minLimit()) {
      finalValue = this.minLimit();
    } else if (finalValue > this.maxLimit()) {
      finalValue = this.maxLimit();
    }

    this.quantityChange.emit(this.round(finalValue));
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private stopEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}
