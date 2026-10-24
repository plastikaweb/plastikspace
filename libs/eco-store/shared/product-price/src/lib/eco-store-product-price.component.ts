import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

export type ProductPriceSize = 'sm' | 'md' | 'lg' | 'detail';

/** Module-level Intl.NumberFormat instance to avoid allocation churn on re-renders. */
const PRICE_FORMATTER = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
});

/**
 * Component to display a product's price with unit type and optional unit chip.
 */
@Component({
  selector: 'eco-store-product-price',
  imports: [TranslateModule, CurrencyPipe, EcoStoreUnitChipComponent],
  template: `
    <div role="text" [class]="containerClass()">
      <!-- Text for screen readers: natural and complete reading -->
      <span class="sr-only">
        {{ price() | currency }} / {{ 'products.unit.type.' + unitType() | translate }}
      </span>
      <!-- Content -->
      <div aria-hidden="true" [class]="contentClass()">
        <div [class]="priceContainerClass()">
          <span [class]="priceClass()">
            @let parts = priceParts();
            <span class="price-integer">{{ parts.integer }}</span>
            <span class="price-separator">,</span>
            <span class="price-decimal mt-[0.2em] inline-block align-top text-[0.6em]">{{
              parts.decimal
            }}</span>
            <span class="price-symbol mt-[0.2em] ml-1 inline-block align-top text-[0.6em]">{{
              parts.symbol
            }}</span>
          </span>
          <span [class]="unityTypeClass()"
            >/ {{ 'products.unit.type.' + unitType() | translate }}</span
          >
        </div>
        @if (unitChipVisible()) {
          <eco-store-unit-chip
            [unitType]="unitType()"
            [unitBase]="unitBase()"
            [class]="chipClass()" />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductPriceComponent {
  /** The product price with IVA included. */
  price = input.required<EcoStoreProduct['priceWithIva']>();

  /** The unit type of the product (e.g., 'unit', 'kg'). */
  unitType = input.required<EcoStoreProduct['unitType']>();

  /** The unit base measure of the product. */
  unitBase = input.required<EcoStoreProduct['unitBase']>();

  /** Size variant of the price display. */
  size = input<ProductPriceSize>('md');

  /** Whether to show the unit chip badge. */
  unitChipVisible = input<boolean>(true);

  /**
   * Computed numeric and symbol parts for custom price styling.
   * Utilizes module-cached PRICE_FORMATTER to eliminate Intl instantiation cost.
   */
  protected readonly priceParts = computed(() => {
    const formatted = PRICE_FORMATTER.format(this.price() ?? 0);
    const symbol = '€';
    const numericPart = formatted.replace(symbol, '').trim();
    const [integer, decimal] = numericPart.split(',');

    return {
      symbol,
      integer: integer || '0',
      decimal: decimal || '00',
    };
  });

  /** Container class computed from size. */
  protected readonly containerClass = computed(() => {
    const base = 'flex';

    return this.size() === 'detail' ? `${base} w-full` : `${base} space-y-1`;
  });

  /** Content class computed from size. */
  protected readonly contentClass = computed(() => {
    return this.size() === 'detail'
      ? 'items-start flex-row gap-8 text-xl'
      : 'items-baseline flex-col';
  });

  /** Unit type class computed from size. */
  protected readonly unityTypeClass = computed(() => {
    return this.size() === 'detail'
      ? 'text-lg font-medium text-sys-primary'
      : 'text-sm font-normal text-sys-primary';
  });

  /** Price container class computed from size. */
  protected readonly priceContainerClass = computed(() => {
    const base = 'flex items-baseline';

    return this.size() === 'detail' ? `${base} gap-4 mb-4` : `${base} gap-sub`;
  });

  /** Price typography class computed from size. */
  protected readonly priceClass = computed(() => {
    switch (this.size()) {
      case 'detail':
        return 'text-display-medium font-bold text-sys-primary';
      case 'lg':
        return 'text-headline-large font-bold text-sys-primary';
      case 'sm':
        return 'text-title-medium font-bold text-sys-primary';
      case 'md':
        return 'text-headline-small font-bold text-sys-primary';
      default:
        return 'text-headline-medium font-extrabold text-sys-primary';
    }
  });

  /** Unit chip style class computed from size. */
  protected readonly chipClass = computed(() => {
    return this.size() === 'detail' ? 'scale-125 origin-left mt-2' : '';
  });
}
