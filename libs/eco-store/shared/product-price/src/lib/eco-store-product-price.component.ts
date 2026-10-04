import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

export type ProductPriceSize = 'sm' | 'md' | 'lg' | 'detail';

/**
 * Module-level formatter instance to avoid re-creating `Intl.NumberFormat` on every change detection pass per card.
 */
const CURRENCY_FORMATTER = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: 'EUR',
});

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
  price = input.required<EcoStoreProduct['priceWithIva']>();
  unitType = input.required<EcoStoreProduct['unitType']>();
  unitBase = input.required<EcoStoreProduct['unitBase']>();
  size = input<ProductPriceSize>('md');
  unitChipVisible = input<boolean>(true);

  protected priceParts = computed(() => {
    const formatted = CURRENCY_FORMATTER.format(this.price());
    const symbol = '€';
    const numericPart = formatted.replace(symbol, '').trim();
    const [integer, decimal] = numericPart.split(',');

    return {
      symbol,
      integer,
      decimal: decimal || '00',
    };
  });

  protected containerClass = computed(() => {
    const base = 'flex';

    return this.size() === 'detail' ? `${base} w-full` : `${base} space-y-1`;
  });

  protected contentClass = computed(() => {
    return this.size() === 'detail'
      ? 'items-start flex-row gap-8 text-xl'
      : 'items-baseline flex-col';
  });

  protected unityTypeClass = computed(() => {
    // Polish: Use primary variant for secondary metadata
    return this.size() === 'detail'
      ? 'text-lg font-medium text-sys-primary'
      : 'text-sm font-normal text-sys-primary';
  });

  protected priceContainerClass = computed(() => {
    const base = 'flex items-baseline';

    return this.size() === 'detail' ? `${base} gap-4 mb-4` : `${base} gap-sub`;
  });

  protected priceClass = computed(() => {
    // Polish: Use system typography and color tokens
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

  protected chipClass = computed(() => {
    return this.size() === 'detail' ? 'scale-125 origin-left mt-2' : '';
  });

  protected getPriceParts() {
    return this.priceParts();
  }
}
