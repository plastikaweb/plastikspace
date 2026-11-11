import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

export type ProductPriceSize = 'sm' | 'md' | 'lg' | 'detail';

/**
 * Module-scoped currency formatter instance to avoid re-instantiating Intl.NumberFormat on every render cycle.
 */
const PRICE_FORMATTER = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
});

/**
 * Component to display product price with currency formatting and optional unit chip.
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
  readonly price = input.required<EcoStoreProduct['priceWithIva']>();
  readonly unitType = input.required<EcoStoreProduct['unitType']>();
  readonly unitBase = input.required<EcoStoreProduct['unitBase']>();
  readonly size = input<ProductPriceSize>('md');
  readonly unitChipVisible = input<boolean>(true);

  /**
   * Computed price parts (symbol, integer, decimal) formatted according to ca-ES locale.
   */
  readonly priceParts = computed(() => {
    const rawPrice = this.price();
    const priceVal = typeof rawPrice === 'number' && !Number.isNaN(rawPrice) ? rawPrice : 0;
    const formatted = PRICE_FORMATTER.format(priceVal);

    const symbol = '€';
    const numericPart = formatted.replace(symbol, '').trim();
    const [integer, decimal] = numericPart.split(',');

    return {
      symbol,
      integer: integer || '0',
      decimal: decimal || '00',
    };
  });

  /**
   * Computed container CSS classes.
   */
  readonly containerClass = computed(() => {
    const base = 'flex';

    return this.size() === 'detail' ? `${base} w-full` : `${base} space-y-1`;
  });

  /**
   * Computed content wrapper CSS classes.
   */
  readonly contentClass = computed(() => {
    return this.size() === 'detail'
      ? 'items-start flex-row gap-8 text-xl'
      : 'items-baseline flex-col';
  });

  /**
   * Computed unity type label CSS classes.
   */
  readonly unityTypeClass = computed(() => {
    return this.size() === 'detail'
      ? 'text-lg font-medium text-sys-primary'
      : 'text-sm font-normal text-sys-primary';
  });

  /**
   * Computed price container CSS classes.
   */
  readonly priceContainerClass = computed(() => {
    const base = 'flex items-baseline';

    return this.size() === 'detail' ? `${base} gap-4 mb-4` : `${base} gap-sub`;
  });

  /**
   * Computed price text size and typography CSS classes.
   */
  readonly priceClass = computed(() => {
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

  /**
   * Computed chip element CSS classes.
   */
  readonly chipClass = computed(() => {
    return this.size() === 'detail' ? 'scale-125 origin-left mt-2' : '';
  });
}
