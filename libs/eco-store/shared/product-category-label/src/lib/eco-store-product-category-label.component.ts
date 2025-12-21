import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ProductCategoryLabelSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'eco-store-product-category-label',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="flex items-center" [ngClass]="containerClass()">
      <div
        class="rounded-full shrink-0"
        [ngClass]="dotSizeClass()"
        [style.background-color]="color()"></div>
      <div
        class="font-bold uppercase tracking-wider"
        [ngClass]="textSizeClass()"
        [style.color]="color()">
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
    switch (this.size()) {
      case 'lg':
        return 'gap-3';
      case 'md':
        return 'gap-2.5';
      case 'sm':
      default:
        return 'gap-2';
    }
  });

  dotSizeClass = computed(() => {
    switch (this.size()) {
      case 'lg':
        return 'h-3 w-3';
      case 'md':
        return 'h-2.5 w-2.5';
      case 'sm':
      default:
        return 'h-2 w-2';
    }
  });

  textSizeClass = computed(() => {
    switch (this.size()) {
      case 'lg':
        return 'text-sm';
      case 'md':
        return 'text-[12px]';
      case 'sm':
      default:
        return 'text-[11px]';
    }
  });
}
