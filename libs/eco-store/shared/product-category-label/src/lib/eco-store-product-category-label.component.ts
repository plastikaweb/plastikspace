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
    // Polish: Use standard spacing tokens
    const sizeGap = this.size() === 'lg' ? 'gap-xs' : this.size() === 'md' ? 'gap-sub' : 'gap-tiny';
    return `flex items-center ${sizeGap}`;
  });

  dotClass = computed(() => {
    // Polish: Use precise size tokens for optical balance
    const size =
      this.size() === 'lg' ? 'h-3 w-3' : this.size() === 'md' ? 'h-2 w-2' : 'h-1.5 w-1.5';
    return `rounded-full shrink-0 ${size}`;
  });

  textClass = computed(() => {
    // Polish: Use system typography tokens and more brand-aware weight
    const sizeToken =
      this.size() === 'lg'
        ? 'text-label-large'
        : this.size() === 'md'
          ? 'text-label-medium'
          : 'text-label-small';
    return `font-bold uppercase tracking-wider text-neutral-500! ${sizeToken}`;
  });
}
