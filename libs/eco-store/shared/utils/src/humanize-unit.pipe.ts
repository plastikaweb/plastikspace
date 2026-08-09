import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

@Pipe({
  name: 'humanizeUnit',
})
export class HumanizeUnitPipe implements PipeTransform {
  translate = inject(TranslateService);

  // Private Map to cache Intl.NumberFormat instances to avoid redundant instantiations in hot rendering paths.
  readonly #formatters = new Map<string, Intl.NumberFormat>();

  transform(value: number | null | undefined, unitType: ProductUnitType): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';

    const lang = this.translate.getCurrentLang?.() || 'en-US';
    // avoid unwanted line break
    const spacer = '\u00A0';

    const format = (n: number) => {
      const isInteger = n % 1 === 0;
      const cacheKey = `${lang}_${isInteger ? 'int' : 'dec'}`;
      let formatter = this.#formatters.get(cacheKey);

      if (!formatter) {
        formatter = new Intl.NumberFormat(lang, {
          maximumFractionDigits: 2,
          minimumFractionDigits: isInteger ? 0 : 2,
        });
        this.#formatters.set(cacheKey, formatter);
      }

      return formatter.format(n);
    };

    switch (unitType) {
      case 'volume':
      case 'unitWithFixedVolume':
      case 'unitWithVariableVolume': {
        if (value < 1 && value > 0) {
          return `${format(value * 1000)}${spacer}mL`;
        }
        return `${format(value)}${spacer}L`;
      }
      case 'weight':
      case 'unitWithFixedWeight':
      case 'unitWithVariableWeight': {
        if (value < 1 && value > 0) {
          return `${format(value * 1000)}${spacer}g`;
        }
        return `${format(value)}${spacer}kg`;
      }
      case 'unit':
      default:
        return format(value);
    }
  }
}
