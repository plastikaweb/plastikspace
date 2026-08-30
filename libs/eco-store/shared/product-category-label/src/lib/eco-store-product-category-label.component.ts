import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ProductCategoryLabelSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'eco-store-product-category-label',
  imports: [],
  template: `
    <div [class]="containerClass()">
      <div [class]="dotClass()" [style.background-color]="color()"></div>
      <div [class]="textClass()">
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
    const sizeGap = this.size() === 'lg' ? 'gap-4' : this.size() === 'md' ? 'gap-3' : 'gap-2';

    return `flex items-center ${sizeGap}`;
  });

  dotClass = computed(() => {
    const size = this.size() === 'lg' ? 'size-5' : this.size() === 'md' ? 'size-4' : 'size-3';

    return `rounded-full shrink-0 dark:border dark:border-outline-variant ${size}`;
  });

  textClass = computed(() => {
    const sizeToken =
      this.size() === 'lg'
        ? 'text-label-large'
        : this.size() === 'md'
          ? 'text-label-medium'
          : 'text-label-small';

    return `font-bold uppercase tracking-wider text-on-surface-variant ${sizeToken}`;
  });
}
