import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ProductCategoryLabelSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'eco-store-product-category-label',
  imports: [],
  template: `
    <div [class]="containerClass()">
      <div [class]="dotClass()" [style.background-color]="color()"></div>
      <div [class]="textClass()" [style.color]="color()">
        {{ name() }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProductCategoryLabelComponent {
  name = input.required<string | null | undefined>();
  color = input<string | null | undefined>('#000');
  size = input<ProductCategoryLabelSize>('sm');

  containerClass = computed(() => {
    const sizeGap = this.size() === 'lg' ? 'gap-3' : this.size() === 'md' ? 'gap-2.5' : 'gap-2';
    return `flex items-center ${sizeGap}`;
  });

  dotClass = computed(() => {
    const size =
      this.size() === 'lg' ? 'h-3 w-3' : this.size() === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2';
    return `rounded-full shrink-0 ${size}`;
  });

  textClass = computed(() => {
    const size =
      this.size() === 'lg' ? 'text-sm' : this.size() === 'md' ? 'text-[12px]' : 'text-[11px]';
    return `font-bold uppercase tracking-wider ${size}`;
  });
}
