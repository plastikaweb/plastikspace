import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

export type ProductPriceSize = 'sm' | 'md' | 'lg' | 'detail';

@Component({
  selector: 'eco-store-product-price',
  imports: [TranslateModule, CurrencyPipe, EcoStoreUnitChipComponent],
  template: `
    <div [class]="containerClass()">
      <div [class]="contentClass()">
        <div [class]="priceContainerClass()">
          <span [class]="priceClass()">{{ price() | currency }}</span>
          <span [class]="unityTypeClass()"
            >/ {{ 'products.unit-type.' + unitType() | translate }}</span
          >
        </div>
        <eco-store-unit-chip
          [unitType]="unitType()"
          [unitBase]="unitBase()"
          [class]="chipClass()" />
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

  protected containerClass() {
    const base = 'flex';
    return this.size() === 'detail' ? `${base} w-full` : `${base} space-y-1`;
  }

  protected contentClass() {
    return this.size() === 'detail'
      ? 'items-start flex-row gap-8 text-xl'
      : 'items-baseline flex-col';
  }

  protected unityTypeClass() {
    return this.size() === 'detail'
      ? 'text-lg font-medium text-gray-500'
      : 'text-sm font-medium text-gray-500';
  }

  protected priceContainerClass() {
    const base = 'flex items-baseline';
    return this.size() === 'detail' ? `${base} gap-4 mb-4` : `${base} gap-1`;
  }

  protected priceClass() {
    switch (this.size()) {
      case 'detail':
        return 'text-5xl font-black text-primary-600';
      case 'lg':
        return 'text-3xl font-extrabold text-gray-900';
      case 'sm':
        return 'text-xl font-bold text-gray-900';
      case 'md':
      default:
        return 'text-[clamp(1.5rem,4vw,2rem)] font-extrabold text-gray-900';
    }
  }

  protected chipClass() {
    return this.size() === 'detail' ? 'scale-125 origin-left mt-2' : '';
  }
}
