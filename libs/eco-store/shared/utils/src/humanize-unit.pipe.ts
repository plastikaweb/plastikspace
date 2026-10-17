import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductUnitType } from '@plastik/eco-store/entities';

/** Cached `Intl.NumberFormat` instances keyed by `${lang}_${minDigits}_${maxDigits}` to avoid expensive re-instantiation on every transform. */
const FORMATTER_CACHE = new Map<string, Intl.NumberFormat>();

/**
 * Returns a cached `Intl.NumberFormat` instance for the given language and fraction digits.
 * @param {string | undefined} lang The language code.
 * @param {number} minDigits Minimum fraction digits.
 * @param {number} maxDigits Maximum fraction digits.
 * @returns {Intl.NumberFormat} The cached number formatter instance.
 */
function getNumberFormatter(lang: string | undefined, minDigits: number, maxDigits: number): Intl.NumberFormat {
  const key = `${lang ?? ''}_${minDigits}_${maxDigits}`;
  let formatter = FORMATTER_CACHE.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(lang, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
    });
    FORMATTER_CACHE.set(key, formatter);
  }

  return formatter;
}

@Pipe({
  name: 'humanizeUnit',
})
export class HumanizeUnitPipe implements PipeTransform {
  translate = inject(TranslateService);

  transform(value: number | null | undefined, unitType: ProductUnitType): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '';

    const lang = this.translate.getCurrentLang?.();
    // avoid unwanted line break
    const spacer = '\u00A0';

    const format = (num: number) =>
      getNumberFormatter(lang, num % 1 === 0 ? 0 : 2, 2).format(num);

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
