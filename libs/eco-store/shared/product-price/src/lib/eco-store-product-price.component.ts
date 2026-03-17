import { CurrencyPipe } from '@angular/common';
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
    // Polish: Use primary variant for secondary metadata
    return this.size() === 'detail'
      ? 'text-lg font-medium text-primary-400'
      : 'text-sm font-normal text-primary-400';
  }

  protected priceContainerClass() {
    const base = 'flex items-baseline';
    return this.size() === 'detail' ? `${base} gap-4 mb-4` : `${base} gap-sub`;
  }

  protected priceClass() {
    // Polish: Use system typography and color tokens
    switch (this.size()) {
      case 'detail':
        return 'text-display-medium font-bold text-primary-600!';
      case 'lg':
        return 'text-headline-large font-bold text-primary-600!';
      case 'sm':
        return 'text-title-medium font-bold text-primary-600!';
      case 'md':
        return 'text-headline-small font-bold text-primary-600!';
      default:
        return 'text-headline-medium font-extrabold text-primary-600!';
    }
  }

  protected chipClass() {
    return this.size() === 'detail' ? 'scale-125 origin-left mt-2' : '';
  }
}
